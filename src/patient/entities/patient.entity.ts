import { Entity, Column, OneToMany, Unique, PrimaryColumn, OneToOne } from 'typeorm';
import { RolesTypes } from '../../auth/auth.types';
import { CalendarEntity } from '../../calendar/entity/calendar.entity';
import { AppointmentEntity } from '../../appointment/entity/appointment.entity';
import { FHIRExternalGender, NameStruct } from '../../types/fhir.types';
import { PatientTelecom } from './telecom.entity';
import { PatientIdentifier } from './identifier.entity';

@Entity('patient')
@Unique(['email'])
export class Patient {
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
    default: RolesTypes.PATIENT,
  })
  role: RolesTypes;

  @Column({ type: 'date', name: 'birth_date', nullable: false })
  birthDate: Date;

  @Column({ type: 'jsonb', name: 'name', nullable: false })
  name: NameStruct[];

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => PatientIdentifier, (identifier) => identifier.patient, { cascade: true })
  identifier: PatientIdentifier[];

  @OneToMany(() => PatientTelecom, (telecom) => telecom.patient, {
    cascade: true,
  })
  telecom: PatientTelecom[];

  /*

  @OneToOne(() => CalendarEntity, (cal) => cal.practitioner, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  calendar?: CalendarEntity;

*/

  @OneToMany(() => AppointmentEntity, (appt) => appt.doctor)
  appointmentsAsDoctor?: AppointmentEntity[];

  @OneToMany(() => AppointmentEntity, (appt) => appt.patient)
  appointmentsAsPatient?: AppointmentEntity[];
}
