// src/practitioner/entities/practitioner.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique, PrimaryColumn } from 'typeorm';
import { PractitionerQualification, PractitionerTelecom, PractitionerIdentifier } from './';
import { FHIRExternalGender } from '../practitioner.types';
import type { NameStruct } from '../practitioner.types';
import { RolesTypes } from 'src/auth/auth.types';

@Entity('practitioner')
@Unique(['email'])
export class Practitioner {
  @PrimaryColumn({ type: 'uuid', name: 'keycloak_id', nullable: false })
  keycloakId: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({
    type: 'enum',
    enum: FHIRExternalGender,
    default: FHIRExternalGender.UNKNOWN,
  })
  gender: FHIRExternalGender;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({
    type: 'enum',
    enum: RolesTypes,
    default: RolesTypes.PRACTITIONER,
  })
  role: RolesTypes;

  @Column({ type: 'date', name: 'birth_date', nullable: false })
  birthDate: Date;

  @Column({ type: 'jsonb', name: 'name', nullable: false })
  name: NameStruct[];

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => PractitionerIdentifier, (identifier) => identifier.practitioner, { cascade: true })
  identifier: PractitionerIdentifier[];

  @OneToMany(() => PractitionerTelecom, (telecom) => telecom.practitioner, {
    cascade: true,
  })
  telecom: PractitionerTelecom[];

  @OneToMany(() => PractitionerQualification, (qualification) => qualification.practitioner, { cascade: true })
  qualification: PractitionerQualification[];
}
