import { Module } from '@nestjs/common';
import { QuizOptionService } from './quiz_option.service';
import { QuizOptionController } from './quiz_option.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizOption } from './entities/quiz_option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuizOption])],
  controllers: [QuizOptionController],
  providers: [QuizOptionService],
})
export class QuizOptionModule {}
