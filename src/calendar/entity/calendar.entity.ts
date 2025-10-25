import { AppointmentEntity } from 'src/appointment/entity/appointment.entity';
import { AvailabilityRule } from 'src/availability/entity/availability.entity';
import { Practitioner } from 'src/practitioner/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('calendars')
export class CalendarEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Practitioner, (d) => d.calendar, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_practitioner' })
  practitioner: Practitioner;

  // Default slot length (en minutos) si doctor no define en rule
  @Column({ type: 'int', default: 15 })
  defaultSlotMinutes: number;

  @OneToMany(() => AvailabilityRule, (r) => r.calendar, { cascade: true })
  availabilityRules: AvailabilityRule[];

  @OneToMany(() => AppointmentEntity, (a) => a.calendar, { cascade: true })
  appointments: AppointmentEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
