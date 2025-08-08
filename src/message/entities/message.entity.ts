import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('message')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.sentMessages, { eager: true })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedMessages, { eager: true })
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;
}
