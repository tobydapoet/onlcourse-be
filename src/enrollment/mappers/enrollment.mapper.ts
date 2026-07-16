import { EnrollmentResponseDto } from '../dto/enrollment-response.dto';
import { Enrollment } from '../entities/enrollment.entity';

export class EnrollmentMapper {
  static toResponse(entity: Enrollment): EnrollmentResponseDto {
    return {
      id: entity.id,
      student_id: entity.student?.id ?? null,
      course_id: entity.course?.id ?? null,
      last_order: entity.last_order ?? null,
      isCompleted: entity.isCompleted,
      created_at: entity.created_at,
    };
  }
}
