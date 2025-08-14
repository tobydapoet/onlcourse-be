import { Inject, Injectable } from '@nestjs/common';
import { CreateQuizResponseDto } from './dto/create-quiz_response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizResponse } from './entities/quiz_response.entity';
import { Repository } from 'typeorm';
import { RedisClientType } from 'redis';
import { QuizQuestionService } from 'src/quiz_question/quiz_question.service';

@Injectable()
export class QuizResponseService {
  constructor(
    @InjectRepository(QuizResponse) private resRepo: Repository<QuizResponse>,
    @Inject('REDIS_STORAGE') private cacheStorage: RedisClientType,
    private questionService: QuizQuestionService,
  ) {}
  async create(createQuizResponseDto: CreateQuizResponseDto) {
    const quiz = await this.questionService.findOne(
      createQuizResponseDto.question_id,
    );
    if (!quiz) {
      throw new Error("Can't find this quiz");
    }
    const createReponse = this.resRepo.create({
      quiz: { id: quiz.id },
      quiz_option: { id: createQuizResponseDto.option_id },
      quiz_question: { id: createQuizResponseDto.question_id },
    });
    const savedResponse = await this.resRepo.save(createReponse);
    if (savedResponse) {
      this.cacheStorage.del(`response-quiz:${quiz.id}`);
    }
    return savedResponse;
  }

  async findOne(id: string) {
    const cachedKey = `response:${id}`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const response = await this.resRepo.findOne({ where: { id } });
    if (response) {
      await this.cacheStorage.set(cachedKey, JSON.stringify(response), {
        EX: 60 * 5,
      });
    }
    return response;
  }

  async findByQuiz(id: string) {
    const cachedKey = `response-quiz:${id}`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const responses = await this.resRepo.find({ where: { quiz: { id } } });
    if (responses) {
      await this.cacheStorage.set(cachedKey, JSON.stringify(responses), {
        EX: 60 * 5,
      });
    }
    return responses;
  }

  async findByQuizAndStudent(
    quiz_id: string,
    student_id: string,
  ): Promise<QuizResponse[]> {
    const cachedKey = `response-student-quiz:${student_id}-${quiz_id}`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const responses = await this.resRepo.find({
      where: { quiz: { id: quiz_id }, student: { id: student_id } },
    });
    if (responses) {
      await this.cacheStorage.set(cachedKey, JSON.stringify(responses), {
        EX: 60 * 5,
      });
    }
    return responses;
  }

  async update(id: string, option_id: string) {
    const existingResponse = await this.resRepo.findOne({ where: { id } });
    if (!existingResponse) {
      return new Error("Can't find this response!");
    }
    const updatedQuestion = await this.resRepo.update(
      { id },
      { quiz_option: { id: option_id } },
    );
    if (updatedQuestion) {
      await this.cacheStorage.del(`response-quiz:${existingResponse.id}`);
    }
    return this.resRepo.findOne({ where: { id } });
  }

  async remove(id: string) {
    const existingResponse = await this.resRepo.findOne({ where: { id } });
    if (!existingResponse) {
      return new Error("Can't find this response!");
    }
    const deleteQuestion = await this.resRepo.delete({ id });
    if (deleteQuestion) {
      await this.cacheStorage.del(`response-quiz:${existingResponse.id}`);
    }
    return deleteQuestion;
  }
}
