import { Module } from '@nestjs/common';
import { CourseCategoryService } from './course_category.service';
import { CourseCategoryController } from './course_category.controller';

@Module({
  controllers: [CourseCategoryController],
  providers: [CourseCategoryService],
})
export class CourseCategoryModule {}
