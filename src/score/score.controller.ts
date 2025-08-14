import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ScoreService } from './score.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Post()
  async create(@Body() createScoreDto: CreateScoreDto) {
    try {
      const res = await this.scoreService.create(createScoreDto);
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

  @Get()
  findAll() {
    return this.scoreService.findAll();
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scoreService.findOne(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Get('quiz/:id')
  findByQuiz(@Param('id') id: string) {
    return this.scoreService.findByQuiz(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Get('student/:id')
  findByStudent(@Param('id') id: string) {
    return this.scoreService.findByStudent(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.scoreService.remove(id);
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
