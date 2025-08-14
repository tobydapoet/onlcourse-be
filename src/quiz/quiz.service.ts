import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { MoreThan, Repository } from 'typeorm';
import { LessonService } from 'src/lesson/lesson.service';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { RedisClientType } from '@redis/client';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz) private quizRepo: Repository<Quiz>,
    @Inject(forwardRef(() => LessonService))
    private lessonService: LessonService,
    @Inject('REDIS_STORAGE') private cacheStorage: RedisClientType,
  ) {}
  async create(createQuizDto: CreateQuizDto) {
    const lessons = await this.lessonService.findByCourse(
      createQuizDto.course_id,
    );
    const quizzes = await this.findByCourse(createQuizDto.course_id);
    if (
      lessons.some((lesson: Lesson) => lesson.order === createQuizDto.order) ||
      quizzes.some((quiz: Quiz) => quiz.order === createQuizDto.order)
    ) {
      throw new Error("Can't be duplicate order!");
    }
    const { course_id, ...rest } = createQuizDto;
    const newQuiz = this.quizRepo.create({
      ...rest,
      course: { id: course_id },
    });
    return this.quizRepo.save(newQuiz);
  }

  async findOne(id: string) {
    const cachedKey = `quiz:${id}`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const quiz = await this.quizRepo.findOne({ where: { id } });
    await this.cacheStorage.set(cachedKey, JSON.stringify(quiz), {
      EX: 60 * 5,
    });
    return quiz;
  }

  findByCourse(id: string) {
    return this.quizRepo.find({
      where: { course: { id } },
      order: { order: 'ASC' },
    });
  }

  async update(id: string, updateQuizDto: UpdateQuizDto) {
    const existingQuiz = await this.findOne(id);
    if (!existingQuiz) {
      throw new Error("Can't find this quiz");
    }
    const lessons = await this.lessonService.findByCourse(
      existingQuiz.course.id,
    );
    const quizzes = await this.findByCourse(existingQuiz.course.id);
    if (
      lessons.some((lesson: Lesson) => lesson.order === updateQuizDto.order) ||
      quizzes.some((quiz: Quiz) => quiz.order === updateQuizDto.order)
    ) {
      throw new Error("Can't be duplicate order!");
    }
    const updatedQuiz = await this.quizRepo.update({ id }, updateQuizDto);
    return updatedQuiz;
  }

  async findBeforeInCourse(order: number, course_id: string) {
    return await this.quizRepo.find({
      where: {
        course: { id: course_id },
        order: MoreThan(order),
      },
    });
  }

  async remove(id: string) {
    const existingQuiz = await this.findOne(id);
    if (existingQuiz) {
      const quizzesToUpdate = await this.findBeforeInCourse(
        existingQuiz.order,
        existingQuiz.course.id,
      );
      const lessonsToUpdate = await this.lessonService.findBeforeInCourse(
        existingQuiz.order,
        existingQuiz.course.id,
      );
      for (const quiz of quizzesToUpdate) {
        await this.update(quiz.id, { order: quiz.order - 1 });
      }
      for (const lesson of lessonsToUpdate) {
        await this.update(lesson.id, { order: lesson.order - 1 });
      }
    }
    await this.cacheStorage.del(`course_arrange:${id}`);
    return await this.quizRepo.delete({ id });
  }
}
