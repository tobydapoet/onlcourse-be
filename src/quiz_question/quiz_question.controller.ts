import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QuizQuestionService } from './quiz_question.service';
import { CreateQuizQuestionDto } from './dto/create-quiz_question.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { QuizQuestionMapper } from './mappers/quiz-question.mapper';

@ApiBearerAuth()
@Controller('quiz-question')
export class QuizQuestionController {
  constructor(private readonly quizQuestionService: QuizQuestionService) {}

  @Post()
  @Roles(Role.TEACHER)
  async create(@Body() createQuizQuestionDto: CreateQuizQuestionDto) {
    try {
      const res = await this.quizQuestionService.create(createQuizQuestionDto);
      return {
        data: QuizQuestionMapper.toResponse(res),
      };
    } catch (err: any) {
      return {
        message: err.message,
      };
    }
  }

  @Get('quiz/:id')
  @ApiParam({ name: 'id', type: String })
  async findByQuiz(@Param('id') id: string) {
    const questions = await this.quizQuestionService.findByQuiz(id);
    return questions.map(QuizQuestionMapper.toResponse);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string) {
    const question = await this.quizQuestionService.findOne(id);
    return question ? QuizQuestionMapper.toResponse(question) : null;
  }

  @Patch(':id')
  @Roles(Role.TEACHER)
  async update(@Param('id') id: string, @Body() question_text: string) {
    try {
      const res = await this.quizQuestionService.update(id, question_text);
      return {
        data: res ? QuizQuestionMapper.toResponse(res) : null,
      };
    } catch (err: any) {
      return {
        message: err.message,
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const res = await this.quizQuestionService.remove(id);
      return {
        success: true,
      };
    } catch (err: any) {
      return {
        message: err.message,
      };
    }
  }
}
