import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { PractitionerQualification } from './qualification.entity';

@Entity('qualification_code')
export class QualificationCode {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  code: string; 

  @Column({ type: 'varchar', length: 100 })
  display: string;

  @OneToMany(() => PractitionerQualification, (q) => q.codeRef)
  qualifications: PractitionerQualification[];
}
