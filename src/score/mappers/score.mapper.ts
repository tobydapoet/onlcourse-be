import { ScoreResponseDto } from '../dto/score-response.dto';
import { Score } from '../entities/score.entity';

export class ScoreMapper {
  static toResponse(entity: Score): ScoreResponseDto {
    return {
      id: entity.id,
      student_id: entity.student?.id ?? null,
      quiz_id: entity.quiz?.id ?? null,
      total: Number(entity.total),
      correct: entity.correct,
    };
  }
}
