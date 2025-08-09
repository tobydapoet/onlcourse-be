import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { CreateTeacherDto } from 'src/teacher/dto/create-teacher.dto';
import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TeacherRole } from 'src/auth/enums/teacher-role';

export class CreateTeacherUserDto extends IntersectionType(CreateUserDto) {
  @IsNotEmpty()
  @IsEnum(TeacherRole)
  role_type: TeacherRole;

  @IsDate()
  hr_date?: Date;

  @IsString()
  degree?: string;
}
