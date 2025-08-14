import { Module } from '@nestjs/common';
import { QuizQuestionService } from './quiz_question.service';
import { QuizQuestionController } from './quiz_question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizQuestion } from './entities/quiz_question.entity';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([QuizQuestion]), CacheModule],
  controllers: [QuizQuestionController],
  providers: [QuizQuestionService],
  exports: [QuizQuestionService],
})
export class QuizQuestionModule {}
