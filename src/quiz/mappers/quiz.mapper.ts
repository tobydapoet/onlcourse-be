import { QuizResponseDto } from '../dto/quiz-response.dto';
import { Quiz } from '../entities/quiz.entity';

export class QuizMapper {
  static toResponse(entity: Quiz): QuizResponseDto {
    return {
      id: entity.id,
      title: entity.title,
      course_id: entity.course?.id ?? null,
      order: entity.order,
      duration: entity.duration ?? null,
    };
  }
}
