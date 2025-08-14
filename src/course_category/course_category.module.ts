import { Module } from '@nestjs/common';
import { CourseCategoryService } from './course_category.service';
import { CourseCategoryController } from './course_category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseCategory } from './entities/course_category.entity';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([CourseCategory]), CacheModule],
  controllers: [CourseCategoryController],
  providers: [CourseCategoryService],
})
export class CourseCategoryModule {}
