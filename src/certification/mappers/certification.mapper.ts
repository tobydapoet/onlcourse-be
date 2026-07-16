import { CertificationResponseDto } from '../dto/certification-response.dto';
import { Certification } from '../entities/certification.entity';

export class CertificationMapper {
  static toResponse(entity: Certification): CertificationResponseDto {
    return {
      id: entity.id,
      course_id: entity.course?.id ?? null,
      file_url: entity.file_url,
    };
  }
}
