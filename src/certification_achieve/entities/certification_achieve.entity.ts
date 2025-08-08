import { Certification } from 'src/certification/entities/certification.entity';
import { Student } from 'src/student/entities/student.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cerification_achieve')
export class CertificationAchieve {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, (student) => student.certification_achieves)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(
    () => Certification,
    (certification) => certification.certification_achieves,
  )
  @JoinColumn({ name: 'certification_id' })
  certification: Certification;

  @CreateDateColumn()
  creted_at: Date;
}
