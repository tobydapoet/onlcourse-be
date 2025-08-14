import { Course } from 'src/course/entities/course.entity';
import { Student } from 'src/student/entities/student.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('enrollment')
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, (student) => student.enrollments, { eager: true })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Course, (crourse) => crourse.enrollments, { eager: true })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ type: 'int', nullable: true })
  last_order: number;

  @Column({ type: 'boolean', default: false })
  isCompleted: boolean;

  @CreateDateColumn()
  created_at: Date;
}
