import { Quiz } from 'src/quiz/entities/quiz.entity';
import { QuizOption } from 'src/quiz_option/entities/quiz_option.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('quiz_quesion')
export class QuizQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { eager: true })
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;

  @Column({ type: 'text', nullable: false })
  question_text: string;

  @OneToMany(() => QuizOption, (option) => option.quiz_question)
  quiz_options: QuizOption[];
}
