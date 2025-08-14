import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCourseCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  category_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  course_id: string;
}
