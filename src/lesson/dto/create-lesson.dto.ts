import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  order: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  teacher_id: string;

  @ApiProperty()
  @IsString()
  assistant_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  course_id: string;
}
