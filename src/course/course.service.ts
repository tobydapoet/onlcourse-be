import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Like, Repository } from 'typeorm';
import { RedisClientType } from '@redis/client';
import { UploadService } from 'src/upload/upload.service';
import { QuizService } from 'src/quiz/quiz.service';
import { LessonService } from 'src/lesson/lesson.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @Inject('REDIS_STORAGE') private cacheStorage: RedisClientType,
    private uploadService: UploadService,
    private quizService: QuizService,
    private lessonService: LessonService,
  ) {}
  async create(createCourseDto: CreateCourseDto, file?: Express.Multer.File) {
    if (file) {
      const uploadResult = await this.uploadService.uploadFile(
        file,
        'course',
        'image',
      );
      createCourseDto.thumbnail_url = uploadResult.url;
    }
    const newCourse = await this.courseRepo.insert(createCourseDto);
    if (newCourse) {
      await this.cacheStorage.del(`course:all`);
    }
    return newCourse;
  }

  async findAll() {
    const cachedKey = 'course:all';
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const allCourses = await this.courseRepo.find();
    await this.cacheStorage.set(cachedKey, JSON.stringify(allCourses), {
      EX: 60 * 5,
    });
    return allCourses;
  }

  async findOne(id: string) {
    const cachedKey = `course:${id}`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const allCourses = await this.courseRepo.findOne({ where: { id } });
    await this.cacheStorage.set(cachedKey, JSON.stringify(allCourses), {
      EX: 60 * 5,
    });
    return allCourses;
  }

  async arrangeAllInCourse(id: string) {
    const cachedKey = `course_arrange:${id}`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const lessions = await this.lessonService.findByCourse(id);
    const quizzes = await this.quizService.findByCourse(id);
    const merged = [...lessions, ...quizzes];
    merged.sort((a, b) => a.order - b.order);
    await this.cacheStorage.set(cachedKey, JSON.stringify(merged), {
      EX: 60 * 5,
    });
    return merged;
  }

  async totalLessonAndQuiz(id: string) {
    const lessions = await this.lessonService.findByCourse(id);
    const quizzes = await this.quizService.findByCourse(id);
    return lessions.length + quizzes.length;
  }

  async search(keyword: string) {
    return await this.courseRepo.find({
      where: [{ title: Like(`%${keyword}%`) }],
    });
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
    file?: Express.Multer.File,
  ) {
    const existingCourse = await this.courseRepo.findOne({ where: { id } });
    if (!existingCourse) {
      throw new UnauthorizedException("Can't find this course!");
    }
    if (file) {
      if (existingCourse.thumbnail_url) {
        return await this.uploadService.deleteImage(
          existingCourse.thumbnail_url,
        );
      }
      const uploadFile = await this.uploadService.uploadFile(
        file,
        'course',
        'image',
      );
      updateCourseDto.thumbnail_url = uploadFile.url;
    }
    const updatedCourse = await this.courseRepo.update({ id }, updateCourseDto);
    if (updatedCourse) {
      await this.cacheStorage.del(`course:all`);
      await this.cacheStorage.del(`course:${id}`);
    }
    return await this.findOne(id);
  }

  async remove(id: string) {
    const existingCourse = await this.courseRepo.findOne({ where: { id } });
    if (!existingCourse) {
      throw new UnauthorizedException("Can't find this course!");
    }
    const updatedCourse = await this.courseRepo.update(
      { id },
      { isDeleted: true },
    );
    if (updatedCourse) {
      await this.cacheStorage.del(`course:all`);
      await this.cacheStorage.del(`course:${id}`);
    }
  }
}
