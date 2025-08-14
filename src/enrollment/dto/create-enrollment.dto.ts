import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEnrollmentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  student_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  course_id: string;
}
