import { Entity, Column, OneToMany, Unique, PrimaryColumn, OneToOne } from 'typeorm';
import { RolesTypes } from '../../auth/auth.types';
import { AppointmentEntity } from '../../appointment/entity/appointment.entity';
import { FHIRExternalGender, NameStruct } from '../../types/fhir.types';
import { PatientTelecom } from './telecom.entity';
import { PatientIdentifier } from './identifier.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('patient')
@Unique(['email'])
export class Patient {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', description: 'ID de Keycloak del paciente' })
  @PrimaryColumn({ type: 'uuid', name: 'keycloak_id', nullable: false })
  keycloakId: string;

  @ApiProperty({ example: true, description: 'Estado activo del paciente' })
  @Column({ type: 'boolean', default: true })
  active: boolean;

  @ApiProperty({ enum: FHIRExternalGender, example: FHIRExternalGender.FEMALE, description: 'Género del paciente' })
  @Column({
    type: 'enum',
    enum: FHIRExternalGender,
    default: FHIRExternalGender.UNKNOWN,
  })
  gender: FHIRExternalGender;

  @ApiProperty({ example: 'jane.doe@example.com', description: 'Email del paciente' })
  @Column({ type: 'varchar', nullable: false })
  email: string;

  @ApiProperty({ enum: RolesTypes, example: RolesTypes.PATIENT, description: 'Rol del usuario' })
  @Column({
    type: 'enum',
    enum: RolesTypes,
    default: RolesTypes.PATIENT,
  })
  role: RolesTypes;

  @ApiProperty({ example: '1990-05-20', description: 'Fecha de nacimiento del paciente (YYYY-MM-DD)' })
  @Column({ type: 'date', name: 'birth_date', nullable: false })
  birthDate: Date;

  @ApiProperty({
    example: [{ family: 'Doe', given: ['Jane'] }],
    description: 'Nombres del paciente',
  })
  @Column({ type: 'jsonb', name: 'name', nullable: false })
  name: NameStruct[];

  @ApiProperty({ example: '2023-10-27T10:00:00Z', description: 'Fecha de creación del registro' })
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ type: () => [PatientIdentifier], description: 'Identificadores del paciente' })
  @OneToMany(() => PatientIdentifier, (identifier) => identifier.patient, { cascade: true })
  identifier: PatientIdentifier[];

  @ApiProperty({ type: () => [PatientTelecom], description: 'Información de contacto del paciente' })
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
