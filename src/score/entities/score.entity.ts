import { Quiz } from 'src/quiz/entities/quiz.entity';
import { Student } from 'src/student/entities/student.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('score')
export class Score {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, (student) => student.scores)
  student: Student;

  @ManyToOne(() => Quiz, (quiz) => quiz.scores)
  quiz: Quiz;

  @Column({ type: 'decimal', nullable: false })
  total: number;
}
