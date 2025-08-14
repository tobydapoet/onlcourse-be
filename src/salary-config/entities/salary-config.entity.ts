import { Teacher } from 'src/teacher/entities/teacher.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('salary')
export class SalaryConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.salaries, { eager: true })
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @Column({ type: 'int', nullable: true })
  base_salary: Number;

  @Column({ type: 'int', nullable: true })
  hourly_rate: Number;

  @Column({ type: 'int', nullable: true })
  hours_worked: Number;

  @Column({ type: 'int', nullable: true })
  penalty: Number;

  @Column({ type: 'decimal', scale: 2, nullable: true, default: 0 })
  bonus_rate: Number;

  @Column({ type: 'decimal', nullable: true })
  total: Number;

  @CreateDateColumn()
  created_at: Date;
}
