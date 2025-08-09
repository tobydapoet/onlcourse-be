import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsDate()
  dob?: Date;

  @IsEnum(['Nam', 'Nữ'])
  gender?: ['Name', 'Nữ'];
}
