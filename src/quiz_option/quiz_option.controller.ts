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

@Controller('quiz-option')
export class QuizOptionController {
  constructor(private readonly quizOptionService: QuizOptionService) {}

  @Post()
  async create(@Body() createQuizOptionDto: CreateQuizOptionDto) {
    try {
      const res = await this.quizOptionService.create(createQuizOptionDto);
      return {
        success: true,
        data: res,
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  @ApiParam({ name: 'id', type: String })
  @Get('option/:id')
  findByQuizQuestion(@Param('id') id: string) {
    return this.quizOptionService.findByQuizQuestion(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizOptionService.findOne(id);
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
        success: true,
        data: res,
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.quizOptionService.remove(id);
      return {
        success: true,
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}
