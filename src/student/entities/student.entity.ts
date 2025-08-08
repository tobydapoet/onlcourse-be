import { CertificationAchieve } from 'src/certification_achieve/entities/certification_achieve.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { Score } from 'src/score/entities/score.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('student')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.student, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'date' })
  dob: Date;

  @Column({ type: 'enum', enum: ['Nam', 'Nữ'] })
  gender: ['Name', 'Nữ'];

  @OneToMany(() => Score, (score) => score.student)
  scores: Score[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];

  @OneToMany(() => CertificationAchieve, (achieve) => achieve.student)
  certification_achieves: CertificationAchieve[];
}
