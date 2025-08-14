import { Inject, Injectable } from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from './entities/score.entity';
import { QuizResponseService } from 'src/quiz_response/quiz_response.service';
import { RedisClientType } from 'redis';

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
      await this.cacheStorage.del(`score:all`);
      await this.cacheStorage.del(`score:${savedScore.id}`);
      await this.cacheStorage.del(`score-student:${savedScore.student.id}`);
      await this.cacheStorage.del(`score-quiz:${savedScore.quiz.id}`);
    }
    return savedScore;
  }

  async findAll() {
    const cachedKey = `score:all`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const allScores = await this.scoreRepo.find();
    await this.cacheStorage.set(cachedKey, JSON.stringify(allScores), {
      EX: 60 * 5,
    });
    return allScores;
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
      await this.cacheStorage.del(`score:all`);
      await this.cacheStorage.del(`score:${id}`);
      await this.cacheStorage.del(`score-student:${existingScore.student.id}`);
      await this.cacheStorage.del(`score-quiz:${existingScore.quiz.id}`);
    }
    return deletedScore;
  }
}
