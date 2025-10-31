import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarEntity } from './entity/calendar.entity';
import { AppointmentEntity } from '../appointment/entity/appointment.entity';
import { Practitioner } from '../practitioner/entities/practitioner.entity';
import { CreateCalendarDto } from './dtos/create-calendar.dto';
import { UpdateCalendarDto } from './dtos/update-calendar.dto';
import { CalendarDayViewDto, CalendarWeekViewDto } from './dtos/calendar-view.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEntity)
    private readonly calendarRepo: Repository<CalendarEntity>,

    @InjectRepository(Practitioner)
    private readonly practitionerRepo: Repository<Practitioner>,

    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepo: Repository<AppointmentEntity>,
  ) {}

  async createOrGetCalendar(doctorKeycloakId: string, dto?: CreateCalendarDto): Promise<CalendarEntity> {
    const doctor = await this.practitionerRepo.findOne({
      where: { keycloakId: doctorKeycloakId },
      relations: ['calendar'],
    });

    if (!doctor) throw new NotFoundException('Doctor no encontrado');

    if (doctor.calendar) {
      return doctor.calendar;
    }

    const calendar = this.calendarRepo.create({
      practitioner: doctor,
      defaultSlotMinutes: dto?.defaultSlotMinutes || 15,
    });

    return this.calendarRepo.save(calendar);
  }

  async findByDoctor(doctorKeycloakId: string): Promise<CalendarEntity> {
    const calendar = await this.calendarRepo.findOne({
      where: { practitioner: { keycloakId: doctorKeycloakId } },
      relations: ['availabilityRules', 'appointments'],
    });

    if (!calendar) throw new NotFoundException('Calendario no encontrado para este doctor');
    return calendar;
  }

  async update(calendarId: string, dto: UpdateCalendarDto): Promise<CalendarEntity> {
    const calendar = await this.calendarRepo.findOne({ where: { id: calendarId } });
    if (!calendar) throw new NotFoundException('Calendario no encontrado');

    Object.assign(calendar, dto);
    return this.calendarRepo.save(calendar);
  }

  async getDayView(calendarId: string, date: Date): Promise<CalendarDayViewDto> {
    const calendar = await this.calendarRepo.findOne({
      where: { id: calendarId },
      relations: ['appointments'],
    });

    if (!calendar) throw new NotFoundException('Calendario no encontrado');

    date.setHours(0, 0, 0, 0);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const appointments = await this.appointmentRepo.find({
      where: {
        calendar: { id: calendarId },
      },
      relations: ['patient'],
    });

    const dayAppointments = appointments.filter((a) => a.startAt >= date && a.startAt < nextDay);

    return {
      date: date.toISOString().split('T')[0],
      appointments: dayAppointments.map((a) => ({
        id: a.id,
        startAt: a.startAt.toISOString(),
        endAt: a.endAt.toISOString(),
        patientName: a.patientNameSnapshot,
        type: a.type,
        status: a.status,
        joinUrl: a.joinUrl,
      })),
    };
  }

  async getWeekView(calendarId: string, weekStart: Date): Promise<CalendarWeekViewDto> {
    const calendar = await this.calendarRepo.findOne({
      where: { id: calendarId },
      relations: ['appointments'],
    });

    if (!calendar) throw new NotFoundException('Calendario no encontrado');

    weekStart.setHours(0, 0, 0, 0);
    const dayOfWeek = weekStart.getDay();
    const diff = weekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    weekStart.setDate(diff);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const appointments = await this.appointmentRepo.find({
      where: {
        calendar: { id: calendarId },
      },
      relations: ['patient'],
    });

    const weekAppointments = appointments.filter((a) => a.startAt >= weekStart && a.startAt <= weekEnd);

    const days: CalendarDayViewDto[] = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(weekStart);
      currentDate.setDate(currentDate.getDate() + i);

      const dayAppointments = weekAppointments.filter((a) => {
        const aDate = new Date(a.startAt);
        return aDate.toDateString() === currentDate.toDateString();
      });

      days.push({
        date: currentDate.toISOString().split('T')[0],
        appointments: dayAppointments.map((a) => ({
          id: a.id,
          startAt: a.startAt.toISOString(),
          endAt: a.endAt.toISOString(),
          patientName: a.patientNameSnapshot,
          type: a.type,
          status: a.status,
          joinUrl: a.joinUrl,
        })),
      });
    }

    return {
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: weekEnd.toISOString().split('T')[0],
      days,
    };
  }
}
