import { TeacherRole } from 'src/auth/enums/teacher-role';
import { Role } from 'src/auth/enums/role.enum';
import { UserStatus } from '../types/user-status.type';

export class StudentSummaryResponseDto {
  id!: string;
  dob!: Date | null;
  gender!: string | null;
}

export class TeacherSummaryResponseDto {
  id!: string;
  bio!: string | null;
  role_type!: TeacherRole;
  hr_date!: Date;
  degree!: string;
  salary!: number;
}

export class UserResponseDto {
  id!: string;
  email!: string;
  phone!: string | null;
  name!: string;
  avatar_url!: string | null;
  role!: Role;
  status!: UserStatus;
  created_at!: Date;
  student!: StudentSummaryResponseDto | null;
  teacher!: TeacherSummaryResponseDto | null;
}
