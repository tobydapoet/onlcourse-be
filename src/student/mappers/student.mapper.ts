import { StudentResponseDto } from '../dto/student-response.dto';
import { Student } from '../entities/student.entity';

export class StudentMapper {
  static toResponse(entity: Student): StudentResponseDto {
    return {
      id: entity.id,
      user_id: entity.user?.id ?? null,
      dob: entity.dob ?? null,
      gender: entity.gender ? String(entity.gender) : null,
    };
  }
}
