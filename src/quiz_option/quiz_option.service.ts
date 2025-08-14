import { Injectable } from '@nestjs/common';
import { CreateQuizOptionDto } from './dto/create-quiz_option.dto';
import { UpdateQuizOptionDto } from './dto/update-quiz_option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizOption } from './entities/quiz_option.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuizOptionService {
  constructor(
    @InjectRepository(QuizOption)
    private quizOptionRepo: Repository<QuizOption>,
  ) {}
  async create(createQuizOptionDto: CreateQuizOptionDto) {
    return this.quizOptionRepo.insert(createQuizOptionDto);
  }

  findByQuizQuestion(id: string) {
    return this.quizOptionRepo.find({ where: { quiz_question: { id } } });
  }

  findOne(id: string) {
    return this.quizOptionRepo.findOne({ where: { id } });
  }

  update(id: string, updateQuizOptionDto: UpdateQuizOptionDto) {
    return this.quizOptionRepo.update({ id }, updateQuizOptionDto);
  }

  remove(id: string) {
    return this.quizOptionRepo.delete({ id });
  }
}
