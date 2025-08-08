import { Teacher } from 'src/teacher/entities/teacher.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('salary')
export class SalaryConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Teacher, (teacher) => teacher.salaries, { eager: true })
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @Column({ type: 'int', nullable: true })
  base_salary: Number;

  @Column({ type: 'int', nullable: true })
  hourly_salary: Number;

  @Column({ type: 'int', nullable: true })
  session_salary: Number;

  @Column({ type: 'decimal', scale: 2, nullable: true })
  bonus_rate: Number;

  @Column({ type: 'decimal', nullable: true })
  total: Number;
}
