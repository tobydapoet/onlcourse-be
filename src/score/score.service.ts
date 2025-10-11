import { Inject, Injectable } from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from './entities/score.entity';
import { QuizResponseService } from 'src/quiz_response/quiz_response.service';
import { RedisClientType } from 'redis';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score) private scoreRepo: Repository<Score>,
    private responseService: QuizResponseService,
    @Inject('REDIS_STORAGE') private cacheStorage: RedisClientType,
  ) {}

  async create(createScoreDto: CreateScoreDto) {
    const allReponseInQuiz = await this.responseService.findByQuizAndStudent(
      createScoreDto.quiz_id,
      createScoreDto.student_id,
    );
    let correctAnswer = 0;
    for (const response of allReponseInQuiz) {
      if (response.quiz_option.is_correct === true) {
        correctAnswer += 1;
      }
    }
    const total = (correctAnswer * allReponseInQuiz.length) / 100;
    const newScore = this.scoreRepo.create({
      student: { id: createScoreDto.student_id },
      quiz: { id: createScoreDto.quiz_id },
      correct: correctAnswer,
      total,
    });
    const savedScore = await this.scoreRepo.save(newScore);
    if (savedScore) {
      const keys = await this.cacheStorage.keys('score:*');
      if (keys.length > 0) {
        await this.cacheStorage.del(keys);
      }
    }
    return savedScore;
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Score>> {
    const cacheKey = `score:page:${options.page}:limit:${options.limit}`;
    const cached = await this.cacheStorage.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const queryBuilder = this.scoreRepo.createQueryBuilder('score');
    queryBuilder
      .leftJoinAndSelect('score.student', 'student')
      .leftJoinAndSelect('score.quiz', 'quiz');

    const result = await paginate<Score>(queryBuilder, options);

    await this.cacheStorage.set(cacheKey, JSON.stringify(result), {
      EX: 60 * 5,
    });

    return result;
  }

  async findOne(id: string) {
    const cachedKey = `score:${id}`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const score = await this.scoreRepo.findOne({ where: { id } });
    await this.cacheStorage.set(cachedKey, JSON.stringify(score), {
      EX: 60 * 5,
    });
    return score;
  }

  async findByStudent(student_id: string) {
    const cachedKey = `score-student:${student_id}`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const scores = await this.scoreRepo.find({
      where: { student: { id: student_id } },
    });
    await this.cacheStorage.set(cachedKey, JSON.stringify(scores), {
      EX: 60 * 5,
    });
    return scores;
  }

  async findByQuiz(quiz_id: string) {
    const cachedKey = `score-quiz:${quiz_id}`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const scores = await this.scoreRepo.find({
      where: { quiz: { id: quiz_id } },
    });
    await this.cacheStorage.set(cachedKey, JSON.stringify(scores), {
      EX: 60 * 5,
    });
    return scores;
  }

  async remove(id: string) {
    const existingScore = await this.scoreRepo.findOne({ where: { id } });
    if (!existingScore) {
      return new Error("Can't find your score!");
    }
    const deletedScore = await this.scoreRepo.delete({ id });
    if (deletedScore) {
      const keys = await this.cacheStorage.keys('score:*');
      if (keys.length > 0) {
        await this.cacheStorage.del(keys);
      }
    }
    return deletedScore;
  }
}
