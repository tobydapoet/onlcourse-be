import { QuizQuestionResponseDto } from '../dto/quiz-question-response.dto';
import { QuizQuestion } from '../entities/quiz_question.entity';

export class QuizQuestionMapper {
  static toResponse(entity: QuizQuestion): QuizQuestionResponseDto {
    return {
      id: entity.id,
      quiz_id: entity.quiz?.id ?? null,
      question_text: entity.question_text,
    };
  }
}
