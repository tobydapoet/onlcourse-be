import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuizResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  student_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  option_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  question_id: string;
}
