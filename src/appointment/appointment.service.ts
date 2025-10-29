import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentEntity } from './entity/appointment.entity';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';
import { CalendarEntity } from '../calendar/entity/calendar.entity';
import { NotificationService } from '../notifications/notification.service';
import { NotificationChannel, NotificationEventType } from '../notifications/notification.types';
import { Practitioner } from '../practitioner/entities';
import { Patient } from '../patient/entities/patient.entity';

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name);

  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepo: Repository<AppointmentEntity>,

    @InjectRepository(Practitioner)
    private readonly practitionerRepo: Repository<Practitioner>,

    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,

    @InjectRepository(CalendarEntity)
    private readonly calendarRepo: Repository<CalendarEntity>,

    private readonly notificationService: NotificationService,
  ) {}

  async create(dto: CreateAppointmentDto) {
    const doctor = await this.practitionerRepo.findOneBy({ keycloakId: dto.doctorId });
    const patient = await this.patientRepo.findOneBy({ keycloakId: dto.patientId });

    if (!doctor || !patient) throw new NotFoundException('Doctor o paciente no encontrados');

    // Obtener o crear calendario del doctor
    let calendar = await this.calendarRepo.findOne({
      where: { practitioner: { keycloakId: dto.doctorId } },
    });

    if (!calendar) {
      calendar = this.calendarRepo.create({
        practitioner: doctor,
        defaultSlotMinutes: 15,
      });
      calendar = await this.calendarRepo.save(calendar);
    }

    const appointment = this.appointmentRepo.create({
      ...dto,
      doctor,
      patient,
      calendar,
      patientNameSnapshot: `${Array.isArray(patient.name[0].given) ? patient.name[0].given.join(' ') : patient.name[0].given} ${patient.name[0].family ?? ''}`,
      startAt: new Date(dto.startAt),
      endAt: new Date(dto.endAt),
    });

    const saved = await this.appointmentRepo.save(appointment);

    // Log de la cita creada
    this.logger.log(`📅 Cita creada: ${saved.id} - Paciente: ${saved.patientNameSnapshot} - Fecha: ${saved.startAt}`);

    // 🔔 DISPARAR NOTIFICACIÓN DE CREACIÓN
    try {
      const doctorEmail = doctor.telecom?.find((t) => t.system === 'email')?.value || doctor.email;
      const patientEmail = patient.telecom?.find((t) => t.system === 'email')?.value || patient.email;

      // Notificación para el doctor
      if (doctorEmail) {
        await this.notificationService.createForEvent(
          NotificationEventType.APPOINTMENT_CREATED,
          doctorEmail,
          NotificationChannel.EMAIL,
          {
            doctorName: `${Array.isArray(doctor.name[0]?.given) ? doctor.name[0].given.join(' ') : doctor.name[0]?.given} ${doctor.name[0]?.family ?? ''}`,
            date: saved.startAt.toISOString(),
            appointmentId: saved.id,
          },
        );
        this.logger.log(`📧 Notificación enviada al doctor: ${doctorEmail}`);
      }

      // Notificación para el paciente
      if (patientEmail) {
        await this.notificationService.createForEvent(
          NotificationEventType.APPOINTMENT_CREATED,
          patientEmail,
          NotificationChannel.EMAIL,
          {
            doctorName: `${Array.isArray(doctor.name[0]?.given) ? doctor.name[0].given.join(' ') : doctor.name[0]?.given} ${doctor.name[0]?.family ?? ''}`,
            date: saved.startAt.toISOString(),
            appointmentId: saved.id,
          },
        );
        this.logger.log(`📧 Notificación enviada al paciente: ${patientEmail}`);
      }
    } catch (error) {
      this.logger.error(`❌ Error enviando notificación de creación: ${error.message}`);
    }

    return saved;
  }

  async findAll() {
    return this.appointmentRepo.find({
      relations: ['doctor', 'patient'],
      order: { startAt: 'ASC' },
    });
  }

  async findOne(id: string) {
    const appointment = await this.appointmentRepo.findOne({
      where: { id },
      relations: ['doctor', 'patient'],
    });
    if (!appointment) throw new NotFoundException('Cita no encontrada');
    return appointment;
  }

  async findByDoctor(doctorId: string) {
    return this.appointmentRepo.find({
      where: { doctor: { keycloakId: doctorId } },
      relations: ['patient'],
      order: { startAt: 'ASC' },
    });
  }

  async findByPatient(patientId: string) {
    return this.appointmentRepo.find({
      where: { patient: { keycloakId: patientId } },
      relations: ['doctor'],
      order: { startAt: 'ASC' },
    });
  }

  async update(id: string, dto: UpdateAppointmentDto) {
    const appointment = await this.findOne(id);
    const oldStatus = appointment.status;
    const oldStartAt = new Date(appointment.startAt);

    Object.assign(appointment, dto);
    const updated = await this.appointmentRepo.save(appointment);

    // Log del cambio de estado
    if (oldStatus !== updated.status) {
      this.logger.log(`📋 Estado de cita actualizado: ${id} - De: ${oldStatus} A: ${updated.status}`);

      // 🔔 DISPARAR NOTIFICACIÓN SEGÚN EL CAMBIO DE ESTADO
      try {
        const doctorEmail = updated.doctor.telecom?.find((t) => t.system === 'email')?.value || updated.doctor.email;
        const patientEmail = updated.patient.telecom?.find((t) => t.system === 'email')?.value || updated.patient.email;

        const doctorName = `${Array.isArray(updated.doctor.name[0]?.given) ? updated.doctor.name[0].given.join(' ') : updated.doctor.name[0]?.given} ${updated.doctor.name[0]?.family ?? ''}`;

        let eventType: NotificationEventType | null = null;
        let message: string = '';

        if (updated.status === 'cancelled') {
          eventType = NotificationEventType.APPOINTMENT_CANCELLED;
          message = 'cancelada';
        } else if (updated.status === 'confirmed') {
          eventType = NotificationEventType.APPOINTMENT_CREATED;
          message = 'confirmada';
        } else if (oldStartAt.getTime() !== new Date(updated.startAt).getTime()) {
          eventType = NotificationEventType.APPOINTMENT_RESCHEDULED;
          message = 'reprogramada';
        } else if (updated.status === 'completed') {
          eventType = NotificationEventType.APPOINTMENT_COMPLETED;
          message = 'completada';
        }

        // Enviar notificaciones
        if (eventType) {
          if (doctorEmail) {
            if (eventType === NotificationEventType.APPOINTMENT_CANCELLED) {
              await this.notificationService.createForEvent(eventType, doctorEmail, NotificationChannel.EMAIL, {
                doctorName,
                appointmentId: updated.id,
              });
            } else if (eventType === NotificationEventType.APPOINTMENT_RESCHEDULED) {
              await this.notificationService.createForEvent(eventType, doctorEmail, NotificationChannel.EMAIL, {
                doctor: doctorName,
                date: updated.startAt.toISOString(),
              });
            } else if (eventType === NotificationEventType.APPOINTMENT_COMPLETED) {
              await this.notificationService.createForEvent(eventType, doctorEmail, NotificationChannel.EMAIL, {
                doctor: doctorName,
                date: updated.startAt.toISOString(),
              });
            } else {
              await this.notificationService.createForEvent(eventType, doctorEmail, NotificationChannel.EMAIL, {
                doctorName,
                date: updated.startAt.toISOString(),
                appointmentId: updated.id,
              });
            }
            this.logger.log(`📧 Notificación de ${message} enviada al doctor`);
          }

          if (patientEmail) {
            if (eventType === NotificationEventType.APPOINTMENT_CANCELLED) {
              await this.notificationService.createForEvent(eventType, patientEmail, NotificationChannel.EMAIL, {
                doctorName,
                appointmentId: updated.id,
              });
            } else if (eventType === NotificationEventType.APPOINTMENT_RESCHEDULED) {
              await this.notificationService.createForEvent(eventType, patientEmail, NotificationChannel.EMAIL, {
                doctor: doctorName,
                date: updated.startAt.toISOString(),
              });
            } else if (eventType === NotificationEventType.APPOINTMENT_COMPLETED) {
              await this.notificationService.createForEvent(eventType, patientEmail, NotificationChannel.EMAIL, {
                doctor: doctorName,
                date: updated.startAt.toISOString(),
              });
            } else {
              await this.notificationService.createForEvent(eventType, patientEmail, NotificationChannel.EMAIL, {
                doctorName,
                date: updated.startAt.toISOString(),
                appointmentId: updated.id,
              });
            }
            this.logger.log(`📧 Notificación de ${message} enviada al paciente`);
          }
        }
      } catch (error) {
        this.logger.error(`❌ Error enviando notificación de actualización: ${error.message}`);
      }
    }

    return updated;
  }

  async remove(id: string) {
    const appointment = await this.findOne(id);
    const result = await this.appointmentRepo.delete(id);

    if (result.affected === 0) throw new NotFoundException('Cita no encontrada');

    this.logger.log(`🗑️ Cita eliminada: ${id} - Paciente: ${appointment.patientNameSnapshot}`);

    // 🔔 DISPARAR NOTIFICACIÓN DE ELIMINACIÓN/CANCELACIÓN
    try {
      const doctorEmail =
        appointment.doctor.telecom?.find((t) => t.system === 'email')?.value || appointment.doctor.email;
      const patientEmail =
        appointment.patient.telecom?.find((t) => t.system === 'email')?.value || appointment.patient.email;

      const doctorName = `${Array.isArray(appointment.doctor.name[0]?.given) ? appointment.doctor.name[0].given.join(' ') : appointment.doctor.name[0]?.given} ${appointment.doctor.name[0]?.family ?? ''}`;

      if (doctorEmail) {
        await this.notificationService.createForEvent(
          NotificationEventType.APPOINTMENT_CANCELLED,
          doctorEmail,
          NotificationChannel.EMAIL,
          {
            doctorName,
            appointmentId: appointment.id,
          },
        );
        this.logger.log(`📧 Notificación de cancelación enviada al doctor`);
      }

      if (patientEmail) {
        await this.notificationService.createForEvent(
          NotificationEventType.APPOINTMENT_CANCELLED,
          patientEmail,
          NotificationChannel.EMAIL,
          {
            doctorName,
            appointmentId: appointment.id,
          },
        );
        this.logger.log(`📧 Notificación de cancelación enviada al paciente`);
      }
    } catch (error) {
      this.logger.error(`❌ Error enviando notificación de eliminación: ${error.message}`);
    }

    return { deleted: true };
  }
}
