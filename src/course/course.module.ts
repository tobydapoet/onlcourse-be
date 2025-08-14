import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { UploadModule } from 'src/upload/upload.module';
import { CacheModule } from 'src/cache/cache.module';
import { QuizModule } from 'src/quiz/quiz.module';
import { LessonModule } from 'src/lesson/lesson.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
    UploadModule,
    CacheModule,
    QuizModule,
    LessonModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
