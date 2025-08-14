import { forwardRef, Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { UploadModule } from 'src/upload/upload.module';
import { CacheModule } from 'src/cache/cache.module';
import { QuizModule } from 'src/quiz/quiz.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson]),
    UploadModule,
    CacheModule,
    forwardRef(() => QuizModule),
  ],
  controllers: [LessonController],
  providers: [LessonService],
  exports: [LessonService],
})
export class LessonModule {}
