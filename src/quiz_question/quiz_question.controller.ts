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
        success: true,
        data: res,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }
  }

  @Get('quiz/:id')
  @ApiParam({ name: 'id', type: String })
  findByQuiz(id: string) {
    return this.quizQuestionService.findByQuiz(id);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.quizQuestionService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.TEACHER)
  async update(@Param('id') id: string, @Body() question_text: string) {
    try {
      const res = await this.quizQuestionService.update(id, question_text);
      return {
        success: true,
        data: res,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const res = await this.quizQuestionService.remove(id);
      return {
        success: true,
        data: res,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }
  }
}
