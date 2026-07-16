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
import { QuizResponseMapper } from './mappers/quiz-response.mapper';

@ApiBearerAuth()
@Controller('quiz-response')
export class QuizResponseController {
  constructor(private readonly quizResponseService: QuizResponseService) {}

  @Post()
  async create(@Body() createQuizResponseDto: CreateQuizResponseDto) {
    try {
      const res = await this.quizResponseService.create(createQuizResponseDto);
      return {
        data: res.id,
      };
    } catch (err) {
      return {
        message: err.message,
      };
    }
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string) {
    const response = await this.quizResponseService.findOne(id);
    return response ? QuizResponseMapper.toResponse(response) : null;
  }

  @Get('quiz/:id')
  @ApiParam({ name: 'id', type: String })
  async findByQuiz(@Param('id') id: string) {
    const responses = await this.quizResponseService.findByQuiz(id);
    return responses.map(QuizResponseMapper.toResponse);
  }

  @Get('find')
  @ApiQuery({ name: 'quiz', type: String })
  @ApiQuery({ name: 'student', type: String })
  async findByQuizAndStudent(
    @Query('quiz') quiz_id: string,
    @Query('student') student_id: string,
  ) {
    const responses = await this.quizResponseService.findByQuizAndStudent(
      quiz_id,
      student_id,
    );
    return responses.map(QuizResponseMapper.toResponse);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: String })
  async update(@Param('id') id: string, @Body() option_id: string) {
    try {
      const res = await this.quizResponseService.update(id, option_id);
      return {
        data:
          res instanceof Error || !res
            ? res
            : QuizResponseMapper.toResponse(res),
      };
    } catch (err) {
      return {
        message: err.message,
      };
    }
  }

  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.quizResponseService.remove(id);
      return {
        message: 'Delete response success!',
      };
    } catch (err) {
      return {
        message: err.message,
      };
    }
  }
}
