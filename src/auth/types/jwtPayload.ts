import { Role } from '../enums/role.enum';
import { TeacherRole } from '../enums/teacher-role';

export type JwtPayload = {
  id: string;
  sub: string;
  role: Role;
  teacher_role?: TeacherRole;
};
