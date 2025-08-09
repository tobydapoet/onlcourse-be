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
import { Message } from 'src/message/entities/message.entity';
import { Role } from 'src/auth/enums/role.enum';
import { Auth } from 'src/auth/entities/auth.entity';

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

  @Column({ type: 'text', nullable: true })
  avatar_url: string;

  @Column({ type: 'enum', enum: Role, default: Role.STUDENT })
  role: Role;

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
  @OneToMany(() => Auth, (auth) => auth.user)
  sessions: Auth[];

  @OneToOne(() => Student, (student) => student.user, { eager: true })
  student: Student;

  @OneToOne(() => Teacher, (teacher) => teacher.user, { eager: true })
  teacher: Teacher;

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];
}
