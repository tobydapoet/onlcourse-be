import { TeacherRole } from 'src/auth/enums/teacher-role';

export class TeacherResponseDto {
  id!: string;
  user_id!: string | null;
  bio!: string | null;
  role_type!: TeacherRole;
  hr_date!: Date;
  degree!: string;
  salary!: number;
}
