import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('session')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.sessions, { eager: true })
  user: User;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  hashedToken: string;

  @CreateDateColumn()
  created_at: Date;
}
