import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FHIRIdentifierUse, SYSTEM_INTERN } from '../../types/fhir.types';
import { Patient } from './patient.entity';

@Entity('patient_identifier')
export class PatientIdentifier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: FHIRIdentifierUse,
    default: FHIRIdentifierUse.USUAL,
  })
  use: FHIRIdentifierUse;

  @Column({ type: 'text', nullable: false, default: SYSTEM_INTERN })
  system: string;

  @Column({ type: 'varchar', nullable: false })
  value: string;

  @ManyToOne(() => Patient, (patient) => patient.identifier, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ type: 'uuid', name: 'patient_id' })
  patientId: string;
}
