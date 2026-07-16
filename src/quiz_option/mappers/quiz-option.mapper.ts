import { QuizOptionResponseDto } from '../dto/quiz-option-response.dto';
import { QuizOption } from '../entities/quiz_option.entity';

export class QuizOptionMapper {
  static toResponse(entity: QuizOption): QuizOptionResponseDto {
    return {
      id: entity.id,
      option_text: entity.option_text,
      question_id: entity.quiz_question?.id ?? null,
    };
  }
}
