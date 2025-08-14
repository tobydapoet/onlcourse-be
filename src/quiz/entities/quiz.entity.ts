import { Course } from 'src/course/entities/course.entity';
import { QuizQuestion } from 'src/quiz_question/entities/quiz_question.entity';
import { QuizResponse } from 'src/quiz_response/entities/quiz_response.entity';
import { Score } from 'src/score/entities/score.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('quiz')
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  title: string;

  @ManyToOne(() => Course, (course) => course.quizzes, { eager: true })
  @JoinColumn({ name: 'lesson_id' })
  course: Course;

  @Column({ type: 'int' })
  order: number;

  @Column({ type: 'time', nullable: true })
  duration: string;

  @OneToMany(() => QuizQuestion, (question) => question.quiz)
  questions: QuizQuestion[];

  @OneToMany(() => Score, (score) => score.quiz)
  scores: Score[];

  @OneToMany(() => QuizResponse, (response) => response.quiz)
  quiz_responses: QuizResponse[];
}
