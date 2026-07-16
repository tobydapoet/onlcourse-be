import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QuizOptionService } from './quiz_option.service';
import { CreateQuizOptionDto } from './dto/create-quiz_option.dto';
import { UpdateQuizOptionDto } from './dto/update-quiz_option.dto';
import { ApiParam } from '@nestjs/swagger';
import { QuizOptionMapper } from './mappers/quiz-option.mapper';

@Controller('quiz-option')
export class QuizOptionController {
  constructor(private readonly quizOptionService: QuizOptionService) {}

  @Post()
  async create(@Body() createQuizOptionDto: CreateQuizOptionDto) {
    try {
      const res = await this.quizOptionService.create(createQuizOptionDto);
      return {
        data: QuizOptionMapper.toResponse(res),
      };
    } catch (err) {
      return { message: err.message };
    }
  }

  @ApiParam({ name: 'id', type: String })
  @Get('option/:id')
  async findByQuizQuestion(@Param('id') id: string) {
    const options = await this.quizOptionService.findByQuizQuestion(id);
    return options.map(QuizOptionMapper.toResponse);
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const option = await this.quizOptionService.findOne(id);
    return option ? QuizOptionMapper.toResponse(option) : null;
  }

  @ApiParam({ name: 'id', type: String })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuizOptionDto: UpdateQuizOptionDto,
  ) {
    try {
      const res = await this.quizOptionService.update(id, updateQuizOptionDto);
      return {
        data: res,
      };
    } catch (err) {
      return { message: err.message };
    }
  }

  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.quizOptionService.remove(id);
      return {
        message: 'Delete option success!',
      };
    } catch (err) {
      return { message: err.message };
    }
  }
}
