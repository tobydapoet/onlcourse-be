import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { MoreThan, Repository } from 'typeorm';
import { RedisClientType } from 'redis';
import { UploadService } from 'src/upload/upload.service';
import { QuizService } from 'src/quiz/quiz.service';
import { Quiz } from 'src/quiz/entities/quiz.entity';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson) private lessonRepo: Repository<Lesson>,
    @Inject('REDIS_STORAGE') private cacheStorage: RedisClientType,
    private uploadService: UploadService,
    private quizService: QuizService,
  ) {}
  async create(createLessonDto: CreateLessonDto, file: Express.Multer.File) {
    const courseLessons = await this.findByCourse(createLessonDto.course_id);
    const quizzes = await this.quizService.findByCourse(
      createLessonDto.course_id,
    );
    if (
      courseLessons.some(
        (lesson: Lesson) => lesson.order === createLessonDto.order,
      ) ||
      quizzes.some((quiz: Quiz) => quiz.order === createLessonDto.order)
    ) {
      throw new Error("Can't be duplicate order!");
    }
    const { assistant_id, teacher_id, course_id, ...rest } = createLessonDto;
    const videoLesson = await this.uploadService.uploadFile(
      file,
      'lesson',
      'video',
    );
    const newLesson = this.lessonRepo.create({
      ...rest,
      assistant: { id: assistant_id },
      main: { id: teacher_id },
      course: { id: course_id },
      video: videoLesson.url,
    });
    const savedLesson = await this.lessonRepo.save(newLesson);
    if (savedLesson) {
      const course = await this.lessonRepo.findOne({
        where: { course: { id: savedLesson.course.id } },
      });
      await this.cacheStorage.del(`lesson-course:${course?.id}`);
      await this.cacheStorage.del(`lesson:all`);
    }
    return savedLesson;
  }

  async findAll() {
    const cachedKey = 'lesson:all';
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const allLession = await this.lessonRepo.find();
    await this.cacheStorage.set(cachedKey, JSON.stringify(allLession), {
      EX: 60 * 5,
    });
    return allLession;
  }

  async findOne(id: string) {
    const cachedKey = 'lesson:all';
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const lession = await this.lessonRepo.findOne({ where: { id } });
    await this.cacheStorage.set(cachedKey, JSON.stringify(lession), {
      EX: 60 * 5,
    });
    return lession;
  }

  async findByCourse(id: string) {
    const cachedKey = `lesson-course:${id}`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const lessons = await this.lessonRepo.find({
      where: { course: { id } },
      order: { order: 'ASC' },
    });
    if (!lessons) {
      throw new UnauthorizedException("Can't find this lesson in this course!");
    }
    await this.cacheStorage.set(cachedKey, JSON.stringify(lessons));
    return lessons;
  }

  async update(
    id: string,
    updateLessonDto: UpdateLessonDto,
    file?: Express.Multer.File,
  ) {
    const existingLesson = await this.lessonRepo.findOne({ where: { id } });
    if (!existingLesson) {
      throw new Error("Can't find this lesson");
    }
    let currentVideo = existingLesson.video;
    if (file) {
      const uploadFile = await this.uploadService.uploadFile(
        file,
        'lesson',
        'video',
      );
      currentVideo = uploadFile.url;
    }
    if (updateLessonDto.course_id) {
      const courseLessons = await this.findByCourse(updateLessonDto.course_id);
      const quizzes = await this.quizService.findByCourse(
        updateLessonDto.course_id,
      );
      if (
        courseLessons.some(
          (lesson: Lesson) => lesson.order === updateLessonDto.order,
        ) ||
        quizzes.some((quiz: Quiz) => quiz.order === updateLessonDto.order)
      ) {
        throw new Error("Can't be duplicate order!");
      }
    }
    const { assistant_id, teacher_id, course_id, ...rest } = updateLessonDto;
    const updatedLesson = await this.lessonRepo.update(
      { id },
      {
        ...rest,
        assistant: { id: assistant_id },
        main: { id: teacher_id },
        course: { id: course_id },
        video: currentVideo,
      },
    );
    if (updatedLesson) {
      await this.cacheStorage.del(`lesson:all`);
      await this.cacheStorage.del(`lesson:${id}`);
      await this.cacheStorage.del(`lesson-course:${course_id}`);
    }
    return this.lessonRepo.findOne({ where: { id } });
  }

  async findBeforeInCourse(order: number, course_id: string) {
    return await this.lessonRepo.find({
      where: {
        course: { id: course_id },
        order: MoreThan(order),
      },
    });
  }

  async remove(id: string) {
    const existingLesson = await this.lessonRepo.findOne({ where: { id } });
    if (!existingLesson) {
      throw new Error("Can't find this lesson");
    }
    const quizzesToUpdate = await this.findBeforeInCourse(
      existingLesson.order,
      existingLesson.course.id,
    );
    const lessonsToUpdate = await this.quizService.findBeforeInCourse(
      existingLesson.order,
      existingLesson.course.id,
    );
    for (const quiz of quizzesToUpdate) {
      await this.update(quiz.id, { order: quiz.order - 1 });
    }
    for (const lesson of lessonsToUpdate) {
      await this.update(lesson.id, { order: lesson.order - 1 });
    }
    const deletedLesson = await this.lessonRepo.delete({ id });
    if (deletedLesson) {
      await this.cacheStorage.del(`lesson:all`);
      await this.cacheStorage.del(`lesson-course:${existingLesson.course.id}`);
    }
    return deletedLesson;
  }
}
