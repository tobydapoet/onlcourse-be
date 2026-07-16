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
import { CertificationAchieveService } from './certification_achieve.service';
import { CreateCertificationAchieveDto } from './dto/create-certification_achieve.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CertificationAchieveResponseDto } from './dto/certification-achieve-response.dto';
import { CertificationAchieveMapper } from './mappers/certification-achieve.mapper';
import { mapPagination } from 'src/common/dto/pagination-response.dto';

@ApiBearerAuth()
@Controller('certification-achieve')
export class CertificationAchieveController {
  constructor(
    private readonly certificationAchieveService: CertificationAchieveService,
  ) {}

  @Post()
  async create(
    @Body() createCertificationAchieveDto: CreateCertificationAchieveDto,
  ) {
    try {
      const res = await this.certificationAchieveService.create(
        createCertificationAchieveDto,
      );
      return {
        message: 'Create certification success!',
        id: res?.id,
      };
    } catch (err) {
      return {
        message: err.message,
      };
    }
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<CertificationAchieveResponseDto>> {
    const achievements = await this.certificationAchieveService.findAll({
      page,
      limit,
    });
    return mapPagination(achievements, CertificationAchieveMapper.toResponse);
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const achievement = await this.certificationAchieveService.findOne(id);
    return achievement
      ? CertificationAchieveMapper.toResponse(achievement)
      : null;
  }

  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.certificationAchieveService.remove(id);
      return {
        message: 'Delete certification success!',
      };
    } catch (err) {
      return {
        message: err.message,
      };
    }
  }
}
