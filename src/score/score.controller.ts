import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ScoreService } from './score.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Score } from './entities/score.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiBearerAuth()
@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Post()
  async create(@Body() createScoreDto: CreateScoreDto) {
    try {
      const res = await this.scoreService.create(createScoreDto);
      return { message: 'Thank you for your answer!', id: res.id };
    } catch (err) {
      return {
        message: err.message,
      };
    }
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<Score>> {
    limit = limit > 50 ? 50 : limit;
    return this.scoreService.findAll({
      page,
      limit,
      route: '/score',
    });
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
        message: 'Delete score success!',
      };
    } catch (err) {
      return {
        message: err.message,
      };
    }
  }
}
