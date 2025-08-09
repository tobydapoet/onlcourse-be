import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('session')
export class Auth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.sessions, { eager: true })
  user: User;

  @Column({ type: 'varchar', length: 255, nullable: true })
  hashedToken: string;

  @CreateDateColumn()
  created_at: Date;
}
