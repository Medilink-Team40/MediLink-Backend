import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Patient } from './patient.entity';
import { FHIRTelecomSystem, TelecomUses } from '../../types/fhir.types';

@Entity('patient_telecom')
export class PatientTelecom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: FHIRTelecomSystem,
    nullable: true,
  })
  system: FHIRTelecomSystem;

  @Column({ type: 'varchar', nullable: true })
  value: string;

  @Column({
    type: 'enum',
    enum: TelecomUses,
    default: TelecomUses.WORK,
  })
  use: TelecomUses;

  @Column({ type: 'integer', nullable: true })
  rank: number;

  @ManyToOne(() => Patient, (patient) => patient.telecom, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ type: 'uuid', name: 'patient_id' })
  patientId: string;
}
