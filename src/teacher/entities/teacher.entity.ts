import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TeacherRole } from '../types/teacher-role';
import { User } from 'src/user/entities/user.entity';
import { SalaryConfig } from 'src/salary-config/entities/salary-config.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';

@Entity('teacher')
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  bio: string;

  @OneToOne(() => User, (user) => user.teacher, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: TeacherRole })
  role_type: TeacherRole;

  @Column({ type: 'date', nullable: false })
  hr_date: Date;

  @Column({ type: 'text' })
  degree: string;

  @OneToMany(() => SalaryConfig, (salary) => salary.teacher)
  salaries: SalaryConfig[];

  @OneToMany(() => Lesson, (lesson) => lesson.main)
  mainLessons: Lesson[];

  @OneToMany(() => Lesson, (lesson) => lesson.assistant)
  assistantLessons: Lesson[];
}
