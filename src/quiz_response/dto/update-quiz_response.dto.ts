import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizResponseDto } from './create-quiz_response.dto';

export class UpdateQuizResponseDto extends PartialType(CreateQuizResponseDto) {}
