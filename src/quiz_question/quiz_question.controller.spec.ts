import { Test, TestingModule } from '@nestjs/testing';
import { QuizQuestionController } from './quiz_question.controller';
import { QuizQuestionService } from './quiz_question.service';

describe('QuizQuestionController', () => {
  let controller: QuizQuestionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizQuestionController],
      providers: [QuizQuestionService],
    }).compile();

    controller = module.get<QuizQuestionController>(QuizQuestionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
