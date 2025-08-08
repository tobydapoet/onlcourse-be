import { QuizQuestion } from 'src/quiz_question/entities/quiz_question.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('quiz_option')
export class QuizOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  option_text: string;

  @Column({ type: 'boolean', default: false })
  is_correct: boolean;

  @ManyToOne(() => QuizQuestion, (question) => question.quiz_options, {
    eager: true,
  })
  @JoinColumn({ name: 'question_id' })
  quiz_question: QuizQuestion;
}
