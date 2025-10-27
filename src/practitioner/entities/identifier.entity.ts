import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Practitioner } from './practitioner.entity';
import { FHIRIdentifierUse, PractitionerIdentifierType, SYSTEM_INTERN } from '../practitioner.types';

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
  code: PractitionerIdentifierType;

  @Column({ type: 'text', nullable: false, default: SYSTEM_INTERN })
  system: string;

  @Column({ type: 'varchar', nullable: false })
  value: string;

  @ManyToOne(() => Practitioner, (practitioner) => practitioner.identifier, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'practitioner_id' })
  practitioner: Practitioner;

  @Column({ type: 'uuid', name: 'practitioner_id' })
  practitionerId: string;
}
