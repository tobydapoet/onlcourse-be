import { CertificationAchieve } from 'src/certification_achieve/entities/certification_achieve.entity';
import { Course } from 'src/course/entities/course.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('certification')
export class Certification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Course, (course) => course.certification, { eager: true })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ type: 'text', nullable: false })
  file_url: string;

  @OneToMany(() => CertificationAchieve, (achieve) => achieve.certification)
  certification_achieves: CertificationAchieve[];
}
