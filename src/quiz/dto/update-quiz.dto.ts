import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateQuizDto } from './create-quiz.dto';

export class UpdateQuizDto extends PartialType(
  OmitType(CreateQuizDto, ['course_id'] as const),
) {}
