import { TeacherResponseDto } from '../dto/teacher-response.dto';
import { Teacher } from '../entities/teacher.entity';

export class TeacherMapper {
  static toResponse(entity: Teacher): TeacherResponseDto {
    return {
      id: entity.id,
      user_id: entity.user?.id ?? null,
      bio: entity.bio ?? null,
      role_type: entity.role_type,
      hr_date: entity.hr_date,
      degree: entity.degree,
      salary: entity.salary,
    };
  }
}
