import { QuizQuestion } from 'src/quiz_question/entities/quiz_question.entity';
import { QuizResponse } from 'src/quiz_response/entities/quiz_response.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'question_id' })
  quiz_question: QuizQuestion;

  @OneToMany(() => QuizResponse, (response) => response.quiz_option)
  quiz_responses: QuizResponse[];
}
