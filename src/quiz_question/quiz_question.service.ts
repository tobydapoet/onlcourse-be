import { Inject, Injectable } from '@nestjs/common';
import { CreateQuizQuestionDto } from './dto/create-quiz_question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizQuestion } from './entities/quiz_question.entity';
import { Repository } from 'typeorm';
import { RedisClientType } from 'redis';

@Injectable()
export class QuizQuestionService {
  constructor(
    @InjectRepository(QuizQuestion)
    private quizQuestionRepo: Repository<QuizQuestion>,
    @Inject('REDIS_STORAGE') private cacheStorage: RedisClientType,
  ) {}
  async create(createQuizQuestionDto: CreateQuizQuestionDto) {
    const newQuestion = this.quizQuestionRepo.create({
      question_text: createQuizQuestionDto.question_text,
      quiz: { id: createQuizQuestionDto.quiz_id },
    });
    const savedQuestion = await this.quizQuestionRepo.save(newQuestion);
    if (savedQuestion) {
      await this.cacheStorage.del(
        `question-quiz:${createQuizQuestionDto.quiz_id}`,
      );
    }
    return savedQuestion;
  }

  async findByQuiz(id: string) {
    const cachedKey = `question-quiz:${id}`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const questions = await this.quizQuestionRepo.find({
      where: { quiz: { id } },
    });
    await this.cacheStorage.set(cachedKey, JSON.stringify(questions), {
      EX: 60 * 5,
    });
    return questions;
  }

  async findOne(id: string) {
    const cachedKey = `question:${id}`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const question = await this.quizQuestionRepo.findOne({
      where: { id },
    });
    await this.cacheStorage.set(cachedKey, JSON.stringify(question), {
      EX: 60 * 5,
    });
    return question;
  }

  async update(id: string, question_text: string) {
    const existingQuestion = await this.quizQuestionRepo.findOne({
      where: { id },
    });
    if (!existingQuestion) {
      throw new Error("Can't find this question!");
    }
    const updatedQuestion = await this.quizQuestionRepo.update(
      { id },
      { question_text },
    );
    if (updatedQuestion) {
      await this.cacheStorage.del(`question:${id}`);
      await this.cacheStorage.del(`question-quiz:${existingQuestion.quiz.id}`);
    }
    return this.quizQuestionRepo.findOne({ where: { id } });
  }

  async remove(id: string) {
    const existingQuestion = await this.quizQuestionRepo.findOne({
      where: { id },
    });
    if (!existingQuestion) {
      throw new Error("Can't find this question!");
    }
    const deletedQuestion = await this.quizQuestionRepo.delete({ id });
    if (deletedQuestion) {
      await this.cacheStorage.del(`question:${id}`);
      await this.cacheStorage.del(`question-quiz:${existingQuestion.quiz.id}`);
    }
    return this.quizQuestionRepo.findOne({ where: { id } });
  }
}
