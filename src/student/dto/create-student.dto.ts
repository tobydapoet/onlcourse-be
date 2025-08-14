import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @ApiProperty()
  @IsDate()
  dob?: Date;

  @ApiProperty()
  @IsEnum(['Nam', 'Nữ'])
  gender?: ['Name', 'Nữ'];
}
