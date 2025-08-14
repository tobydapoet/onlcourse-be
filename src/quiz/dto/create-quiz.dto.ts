import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateQuizDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  course_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  order: number;

  @ApiProperty()
  @IsString()
  duration?: string;
}
