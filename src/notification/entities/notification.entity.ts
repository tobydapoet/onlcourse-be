import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NotifyType } from '../types/notifyType';

@Entity('notifcation')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: NotifyType, nullable: false })
  type: NotifyType;

  @Column({ type: 'text', nullable: false })
  typeId: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @CreateDateColumn()
  created_at: Date;
}
