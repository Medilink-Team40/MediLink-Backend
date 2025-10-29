import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { CalendarEntity } from '../../calendar/entity/calendar.entity';
import { Practitioner } from '../../practitioner/entities/practitioner.entity';
import { Patient } from '../../patient/entities/patient.entity';

export enum AppointmentType {
  PRESENTIAL = 'presential',
  VIRTUAL = 'virtual',
}

export enum AppointmentStatus {
  OPEN = 'open',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
}

@Entity('appointments')
@Index(['doctor', 'startAt', 'status'])
export class AppointmentEntity {
  @ApiProperty({ description: 'UUID único de la cita' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CalendarEntity, (c) => c.appointments, { onDelete: 'CASCADE' })
  calendar: CalendarEntity;

  @ManyToOne(() => Practitioner, (d) => d.appointmentsAsDoctor, { nullable: false, eager: true })
  doctor: Practitioner;

  @ManyToOne(() => Patient, (p) => p.appointmentsAsPatient, { nullable: false, eager: true })
  patient: Patient;

  @ApiProperty()
  @Column()
  patientNameSnapshot: string;

  @ApiProperty()
  @Column({ type: 'timestamptz' })
  startAt: Date;

  @ApiProperty()
  @Column({ type: 'timestamptz' })
  endAt: Date;

  @ApiProperty()
  @Column({ type: 'int' })
  durationMinutes: number;

  @ApiProperty({ enum: AppointmentType })
  @Column({ type: 'enum', enum: AppointmentType })
  type: AppointmentType;

  @ApiProperty({ enum: AppointmentStatus })
  @Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.OPEN })
  status: AppointmentStatus;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  joinUrl?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
