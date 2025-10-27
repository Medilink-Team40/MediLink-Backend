import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Practitioner } from './practitioner.entity';
import { QualificationCode } from './qualification-codes.entity';

@Entity('practitioner_qualification')
export class PractitionerQualification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => QualificationCode, (code) => code.qualifications, { eager: true })
  @JoinColumn({ name: 'code' })
  codeRef: QualificationCode;

  @Column({ type: 'varchar', length: 20 })
  code: string;

  @Column({ type: 'timestamptz', name: 'period_start', nullable: false })
  periodStart: Date;

  @Column({ type: 'timestamptz', name: 'period_end', nullable: true })
  periodEnd: Date;

  @ManyToOne(() => Practitioner, (practitioner) => practitioner.qualification, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'practitioner_id' })
  practitioner: Practitioner;

  @Column({ type: 'uuid', name: 'practitioner_id' })
  practitionerId: string;
}
