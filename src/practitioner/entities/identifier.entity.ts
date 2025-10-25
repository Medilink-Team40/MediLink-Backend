import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Practitioner } from './practitioner.entity';
import { FHIRIdentifierUse } from '../practitioner.types';

@Entity('practitioner_identifier')
export class PractitionerIdentifier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: FHIRIdentifierUse,
    default: FHIRIdentifierUse.USUAL,
  })
  use: FHIRIdentifierUse;

  @Column({ type: 'varchar', length: 50, nullable: true })
  code: string; // Ej: 'NI', 'PRO', 'ESP'

  @Column({ type: 'text', nullable: false })
  system: string; // URL del sistema, ej: http://sisa.msal.gov.ar/REFEPS

  @Column({ type: 'varchar', nullable: false })
  value: string; // El valor del identificador (ej: '12497922')

  // --- Relación ---
  @ManyToOne(() => Practitioner, (practitioner) => practitioner.identifier, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'practitioner_id' })
  practitioner: Practitioner;

  @Column({ type: 'uuid', name: 'practitioner_id' })
  practitionerId: string;
}
