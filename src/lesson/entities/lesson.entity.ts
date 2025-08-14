import { Course } from 'src/course/entities/course.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('lesson')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  title: string;

  @ManyToOne(() => Course, (course) => course.lessons, { eager: true })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ type: 'int' })
  order: number;

  @Column({ type: 'text', nullable: false })
  video: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.mainLessons, { eager: true })
  @JoinColumn({ name: 'main_id' })
  main: Teacher;

  @ManyToOne(() => Teacher, (teacher) => teacher.assistantLessons, {
    eager: true,
  })
  @JoinColumn({ name: 'assistant_id' })
  assistant: Teacher;

  @CreateDateColumn()
  created_at: Date;
}
