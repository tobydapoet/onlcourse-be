import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateQuizOptionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  option_text: string;

  @ApiProperty()
  @IsBoolean()
  is_correct?: boolean;
}
