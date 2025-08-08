import { Module } from '@nestjs/common';
import { QuizQuestionService } from './quiz_question.service';
import { QuizQuestionController } from './quiz_question.controller';

@Module({
  controllers: [QuizQuestionController],
  providers: [QuizQuestionService],
})
export class QuizQuestionModule {}
