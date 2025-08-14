import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { TeacherRole } from 'src/auth/enums/teacher-role';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeacherUserDto extends IntersectionType(CreateUserDto) {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(TeacherRole)
  role_type: TeacherRole;

  @ApiProperty()
  @IsDate()
  hr_date?: Date;

  @ApiProperty()
  @IsString()
  degree?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  salary: number;
}
