import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TeacherRole } from '../../auth/enums/teacher-role';
import { User } from 'src/user/entities/user.entity';
import { SalaryConfig } from 'src/salary-config/entities/salary-config.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';

@Entity('teacher')
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @OneToOne(() => User, (user) => user.teacher)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: TeacherRole })
  role_type: TeacherRole;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  hr_date: Date;

  @Column({ type: 'text' })
  degree: string;

  @Column({ type: 'int', default: 0 })
  salary: number;

  @OneToMany(() => SalaryConfig, (salary) => salary.teacher)
  salaries: SalaryConfig[];

  @OneToMany(() => Lesson, (lesson) => lesson.main)
  mainLessons: Lesson[];

  @OneToMany(() => Lesson, (lesson) => lesson.assistant)
  assistantLessons: Lesson[];
}
