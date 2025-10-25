import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvailabilityRule } from './entity/availability.entity';
import { CalendarEntity } from 'src/calendar/entity/calendar.entity';
import { AppointmentEntity } from 'src/appointment/entity/appointment.entity';
import { CreateAvailabilityDto } from './dtos/create-availability.dto';
import { UpdateAvailabilityDto } from './dtos/update-availability.dto';
import { AvailableSlotsResponseDto, AvailableSlotDto } from './dtos/available-slots.dto';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(AvailabilityRule)
    private readonly availabilityRepo: Repository<AvailabilityRule>,

    @InjectRepository(CalendarEntity)
    private readonly calendarRepo: Repository<CalendarEntity>,

    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepo: Repository<AppointmentEntity>,
  ) {}

  async create(calendarId: string, dto: CreateAvailabilityDto): Promise<AvailabilityRule> {
    const calendar = await this.calendarRepo.findOne({ where: { id: calendarId } });
    if (!calendar) throw new NotFoundException('Calendario no encontrado');

    if (dto.dayOfWeek < 0 || dto.dayOfWeek > 6) {
      throw new BadRequestException('dayOfWeek debe estar entre 0 y 6');
    }

    const rule = this.availabilityRepo.create({
      ...dto,
      calendar,
    });

    return this.availabilityRepo.save(rule);
  }

  async findByCalendar(calendarId: string): Promise<AvailabilityRule[]> {
    const calendar = await this.calendarRepo.findOne({ where: { id: calendarId } });
    if (!calendar) throw new NotFoundException('Calendario no encontrado');

    return this.availabilityRepo.find({
      where: { calendar: { id: calendarId } },
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }

  async findOne(id: string): Promise<AvailabilityRule> {
    const rule = await this.availabilityRepo.findOne({ where: { id } });
    if (!rule) throw new NotFoundException('Regla de disponibilidad no encontrada');
    return rule;
  }

  async update(id: string, dto: UpdateAvailabilityDto): Promise<AvailabilityRule> {
    const rule = await this.findOne(id);
    Object.assign(rule, dto);
    return this.availabilityRepo.save(rule);
  }

  async remove(id: string): Promise<void> {
    const result = await this.availabilityRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Regla no encontrada');
  }

  async findAvailableSlots(calendarId: string, fromDate: Date, toDate: Date): Promise<AvailableSlotsResponseDto[]> {
    const calendar = await this.calendarRepo.findOne({
      where: { id: calendarId },
      relations: ['availabilityRules'],
    });

    if (!calendar) throw new NotFoundException('Calendario no encontrado');

    const rules = calendar.availabilityRules;
    const slotMinutes = calendar.defaultSlotMinutes || 15;
    const result: AvailableSlotsResponseDto[] = [];

    let currentDate = new Date(fromDate);
    currentDate.setHours(0, 0, 0, 0);

    while (currentDate <= toDate) {
      const dayOfWeek = currentDate.getDay();
      const dayRules = rules.filter((r) => r.dayOfWeek === dayOfWeek);

      const daySlots: AvailableSlotDto[] = [];

      for (const rule of dayRules) {
        const [startHour, startMin] = rule.startTime.split(':').map(Number);
        const [endHour, endMin] = rule.endTime.split(':').map(Number);

        let slotStart = new Date(currentDate);
        slotStart.setHours(startHour, startMin, 0, 0);

        const ruleEndTime = new Date(currentDate);
        ruleEndTime.setHours(endHour, endMin, 0, 0);

        const ruleDuration = rule.slotMinutes || slotMinutes;

        while (slotStart.getTime() + ruleDuration * 60 * 1000 <= ruleEndTime.getTime()) {
          const slotEnd = new Date(slotStart.getTime() + ruleDuration * 60 * 1000);

          const hasConflict = await this.appointmentRepo.findOne({
            where: {
              calendar: { id: calendarId },
              startAt: slotStart,
              endAt: slotEnd,
            },
          });

          daySlots.push({
            startTime: slotStart.toISOString(),
            endTime: slotEnd.toISOString(),
            isAvailable: !hasConflict,
          });

          slotStart = slotEnd;
        }
      }

      if (daySlots.length > 0) {
        result.push({
          date: currentDate.toISOString().split('T')[0],
          slots: daySlots,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }
}
