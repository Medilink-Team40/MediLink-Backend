import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Practitioner } from './practitioner.entity';
import { FHIRTelecomSystem, TelecomUses } from '../../types/fhir.types';
import { TelecomEntity } from '../../types/person.types';

@Entity('practitioner_telecom')
export class PractitionerTelecom implements TelecomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: FHIRTelecomSystem,
    nullable: false,
  })
  system: FHIRTelecomSystem;

  @Column({ type: 'varchar', nullable: false })
  value: string;

  @Column({
    type: 'enum',
    enum: TelecomUses,
    default: TelecomUses.WORK,
  })
  use: TelecomUses;

  @Column({ type: 'integer', nullable: false })
  rank: number;

  @ManyToOne(() => Practitioner, (practitioner) => practitioner.telecom, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'practitioner_id' })
  practitioner: Practitioner;

  @Column({ type: 'uuid', name: 'practitioner_id' })
  practitionerId: string;
}
