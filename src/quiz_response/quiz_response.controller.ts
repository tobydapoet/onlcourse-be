import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { QuizResponseService } from './quiz_response.service';
import { CreateQuizResponseDto } from './dto/create-quiz_response.dto';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('quiz-response')
export class QuizResponseController {
  constructor(private readonly quizResponseService: QuizResponseService) {}

  @Post()
  async create(@Body() createQuizResponseDto: CreateQuizResponseDto) {
    try {
      const res = await this.quizResponseService.create(createQuizResponseDto);
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

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.quizResponseService.findOne(id);
  }

  @Get('quiz/:id')
  @ApiParam({ name: 'id', type: String })
  findByQuiz(@Param('id') id: string) {
    return this.quizResponseService.findByQuiz(id);
  }

  @Get('find')
  @ApiQuery({ name: 'quiz', type: String })
  @ApiQuery({ name: 'student', type: String })
  findByQuizAndStudent(
    @Query('quiz') quiz_id: string,
    @Query('student') student_id: string,
  ) {
    return this.quizResponseService.findByQuizAndStudent(quiz_id, student_id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: String })
  async update(@Param('id') id: string, @Body() option_id: string) {
    try {
      const res = await this.quizResponseService.update(id, option_id);
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

  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.quizResponseService.remove(id);
      return {
        success: true,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }
  }
}
