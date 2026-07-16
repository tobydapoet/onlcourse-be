import { User } from '../entities/user.entity';
import { UserResponseDto } from '../dto/user-response.dto';

export class UserMapper {
  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone ?? null,
      name: user.name,
      avatar_url: user.avatar_url ?? null,
      role: user.role,
      status: user.status,
      created_at: user.created_at,
      student: user.student
        ? {
            id: user.student.id,
            dob: user.student.dob ?? null,
            gender: user.student.gender ? String(user.student.gender) : null,
          }
        : null,
      teacher: user.teacher
        ? {
            id: user.teacher.id,
            bio: user.teacher.bio ?? null,
            role_type: user.teacher.role_type,
            hr_date: user.teacher.hr_date,
            degree: user.teacher.degree,
            salary: user.teacher.salary,
          }
        : null,
    };
  }
}
