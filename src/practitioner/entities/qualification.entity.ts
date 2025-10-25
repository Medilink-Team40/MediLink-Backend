import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Practitioner } from './practitioner.entity';
import { PractitionerIdentifier } from '.';
import type { QualificationCodes } from '../practitioner.types';

@Entity('practitioner_qualification')
export class PractitionerQualification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => PractitionerIdentifier, (identifier) => identifier.practitioner, { cascade: true })
  identifier: PractitionerIdentifier[];

  @Column({ type: 'jsonb', nullable: false })
  code: QualificationCodes[];

  // --- Período de Validez ---
  @Column({ type: 'timestamptz', name: 'period_start', nullable: false })
  periodStart: Date;

  @Column({ type: 'timestamptz', name: 'period_end', nullable: true })
  periodEnd: Date;

  // --- Relación ---
  @ManyToOne(() => Practitioner, (practitioner) => practitioner.qualification, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'practitioner_id' })
  practitioner: Practitioner;

  @Column({ type: 'uuid', name: 'practitioner_id' })
  practitionerId: string;
}
