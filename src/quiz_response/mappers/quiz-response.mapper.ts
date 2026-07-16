import { QuizResponseResponseDto } from '../dto/quiz-response-response.dto';
import { QuizResponse } from '../entities/quiz_response.entity';

export class QuizResponseMapper {
  static toResponse(entity: QuizResponse): QuizResponseResponseDto {
    return {
      id: entity.id,
      student_id: entity.student?.id ?? null,
      quiz_id: entity.quiz?.id ?? null,
      question_id: entity.quiz_question?.id ?? null,
      option_id: entity.quiz_option?.id ?? null,
    };
  }
}
