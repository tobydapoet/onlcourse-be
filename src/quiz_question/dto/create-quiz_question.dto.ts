import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuizQuestionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  quiz_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  question_text: string;
}
