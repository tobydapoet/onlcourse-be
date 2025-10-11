import { Inject, Injectable } from '@nestjs/common';
import { CreateCourseCategoryDto } from './dto/create-course_category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseCategory } from './entities/course_category.entity';
import { Repository } from 'typeorm';
import { RedisClientType } from 'redis';

@Injectable()
export class CourseCategoryService {
  constructor(
    @InjectRepository(CourseCategory)
    private courseCategoryRepo: Repository<CourseCategory>,
    @Inject('REDIS_STORAGE') private cacheStorage: RedisClientType,
  ) {}
  async create(createCourseCategoryDto: CreateCourseCategoryDto) {
    const newCourseCategory = this.courseCategoryRepo.create({
      category: { id: createCourseCategoryDto.category_id },
      course: { id: createCourseCategoryDto.course_id },
    });
    return await this.courseCategoryRepo.save(newCourseCategory);
  }

  findByCourse(id: string) {
    return this.courseCategoryRepo.find({ where: { course: { id } } });
  }

  findByCategory(id: number) {
    return this.courseCategoryRepo.find({ where: { category: { id } } });
  }

  remove(id: number) {
    return this.courseCategoryRepo.delete({ id });
  }
}
