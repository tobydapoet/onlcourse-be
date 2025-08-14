import { Module } from '@nestjs/common';
import { QuizResponseService } from './quiz_response.service';
import { QuizResponseController } from './quiz_response.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizResponse } from './entities/quiz_response.entity';
import { CacheModule } from 'src/cache/cache.module';
import { QuizQuestionModule } from 'src/quiz_question/quiz_question.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuizResponse]),
    CacheModule,
    QuizQuestionModule,
  ],
  controllers: [QuizResponseController],
  providers: [QuizResponseService],
  exports: [QuizResponseService],
})
export class QuizResponseModule {}
