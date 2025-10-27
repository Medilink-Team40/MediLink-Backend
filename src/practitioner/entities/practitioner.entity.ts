import { Entity, Column, OneToMany, Unique, PrimaryColumn, OneToOne } from 'typeorm';
import { PractitionerQualification, PractitionerTelecom, PractitionerIdentifier } from './';
import { RolesTypes } from '../../auth/auth.types';
import { CalendarEntity } from '../../calendar/entity/calendar.entity';
import { AppointmentEntity } from '../../appointment/entity/appointment.entity';
import { FHIRExternalGender, NameStruct } from '../../types/fhir.types';

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

  @OneToOne(() => CalendarEntity, (cal) => cal.practitioner, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  calendar?: CalendarEntity;

  @OneToMany(() => AppointmentEntity, (appt) => appt.doctor)
  appointmentsAsDoctor?: AppointmentEntity[];

  @OneToMany(() => AppointmentEntity, (appt) => appt.patient)
  appointmentsAsPatient?: AppointmentEntity[];

  @OneToMany(() => PractitionerQualification, (qualification) => qualification.practitioner, { cascade: true })
  qualification: PractitionerQualification[];
}
