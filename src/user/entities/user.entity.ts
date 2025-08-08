import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserStatus } from '../types/user-status.type';
import { ProvideType } from '../types/provider.type';
import { Student } from 'src/student/entities/student.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import * as bycript from 'bcrypt';
import { Session } from 'src/session/entities/session.entity';
import { Message } from 'src/message/entities/message.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  phone: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  password: string;

  @Column({ type: 'text', nullable: true })
  provider: string;

  @Column({ type: 'enum', enum: ProvideType, nullable: true })
  provider_type: ProvideType;

  @Column({ type: 'text' })
  avatar_url: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @CreateDateColumn()
  created_at: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bycript.hash(this.password, 10);
    }
  }
  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToOne(() => Student, (student) => student.user)
  student: Student;

  @OneToOne(() => Teacher, (teacher) => teacher.user)
  teacher: Teacher;

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];
}
