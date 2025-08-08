import { Certificate } from 'crypto';
import { Certification } from 'src/certification/entities/certification.entity';
import { CourseCategory } from 'src/course_category/entities/course_category.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('course')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  des: string;

  @Column({ type: 'text', nullable: false })
  thumbnail_url: string;

  @Column({ type: 'int', default: 0 })
  cost: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => CourseCategory, (courseCategory) => courseCategory.course)
  course_categories: CourseCategory[];

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Lesson[];

  @OneToMany(() => Quiz, (quiz) => quiz.course)
  quizzes: Quiz[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  @OneToOne(() => Certification, (certification) => certification.course)
  certification: Certification;
}
