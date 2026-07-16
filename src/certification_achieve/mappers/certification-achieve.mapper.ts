import { CertificationAchieveResponseDto } from '../dto/certification-achieve-response.dto';
import { CertificationAchieve } from '../entities/certification_achieve.entity';

export class CertificationAchieveMapper {
  static toResponse(
    entity: CertificationAchieve,
  ): CertificationAchieveResponseDto {
    return {
      id: entity.id,
      student_id: entity.student?.id ?? null,
      certification_id: entity.certification?.id ?? null,
      created_at: entity.creted_at,
    };
  }
}
