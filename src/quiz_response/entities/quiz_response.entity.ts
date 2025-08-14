import { Quiz } from 'src/quiz/entities/quiz.entity';
import { QuizOption } from 'src/quiz_option/entities/quiz_option.entity';
import { QuizQuestion } from 'src/quiz_question/entities/quiz_question.entity';
import { Student } from 'src/student/entities/student.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('quiz-response')
export class QuizResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, (student) => student.quiz_responses, {
    eager: true,
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Quiz, (quiz) => quiz.quiz_responses, {
    eager: true,
  })
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;

  @ManyToOne(() => QuizQuestion, (question) => question.quiz_responses, {
    eager: true,
  })
  @JoinColumn({ name: 'question_id' })
  quiz_question: QuizQuestion;

  @ManyToOne(() => QuizOption, (option) => option.quiz_responses, {
    eager: true,
  })
  @JoinColumn({ name: 'option_id' })
  quiz_option: QuizOption;
}
