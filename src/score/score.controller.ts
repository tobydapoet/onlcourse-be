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
import { Pagination } from 'nestjs-typeorm-paginate';
import { ScoreResponseDto } from './dto/score-response.dto';
import { ScoreMapper } from './mappers/score.mapper';
import { mapPagination } from 'src/common/dto/pagination-response.dto';

@ApiBearerAuth()
@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Post()
  async create(@Body() createScoreDto: CreateScoreDto) {
    try {
      const res = await this.scoreService.create(createScoreDto);
      return { message: 'Thank you for your answer!', id: res.id };
    } catch (err: any) {
      return {
        message: err.message,
      };
    }
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<ScoreResponseDto>> {
    limit = limit > 50 ? 50 : limit;
    const scores = await this.scoreService.findAll({
      page,
      limit,
      route: '/score',
    });
    return mapPagination(scores, ScoreMapper.toResponse);
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const score = await this.scoreService.findOne(id);
    return score instanceof Error ? score : ScoreMapper.toResponse(score);
  }

  @ApiParam({ name: 'id', type: String })
  @Get('quiz/:id')
  async findByQuiz(@Param('id') id: string) {
    const scores = await this.scoreService.findByQuiz(id);
    return scores.map(ScoreMapper.toResponse);
  }

  @ApiParam({ name: 'id', type: String })
  @Get('student/:id')
  async findByStudent(@Param('id') id: string) {
    const scores = await this.scoreService.findByStudent(id);
    return scores.map(ScoreMapper.toResponse);
  }

  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.scoreService.remove(id);
      return {
        message: 'Delete score success!',
      };
    } catch (err: any) {
      return {
        message: err.message,
      };
    }
  }
}
