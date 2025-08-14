import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NotifyType } from '../types/notifyType';
import { Student } from 'src/student/entities/student.entity';

@Entity('notifcation')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, (student) => student.notifications, { eager: true })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'enum', enum: NotifyType, nullable: false })
  type: NotifyType;

  @Column({ type: 'text', nullable: false })
  typeId: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @CreateDateColumn()
  created_at: Date;
}
