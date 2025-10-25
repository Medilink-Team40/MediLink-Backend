// src/modules/availability/availability.entity.ts
import { CalendarEntity } from 'src/calendar/entity/calendar.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('availability_rules')
export class AvailabilityRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 0 = Domingo, 1 = Lunes, ... 6 = Sábado
  @Column({ type: 'int' })
  dayOfWeek: number;

  // horas como string '09:00' y '17:30' (time)
  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  // si null usa calendar.defaultSlotMinutes
  @Column({ type: 'int', nullable: true })
  slotMinutes?: number;

  // ejemplo: reglas repetitivas semanales
  @ManyToOne(() => CalendarEntity, (c) => c.availabilityRules, {
    onDelete: 'CASCADE',
  })
  calendar: CalendarEntity;
}
