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
import { Certification } from 'src/certification/entities/certification.entity';
import { CertificationAchieve } from './entities/certification_achieve.entity';

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
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<CertificationAchieve>> {
    return this.certificationAchieveService.findAll({ page, limit });
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.certificationAchieveService.findOne(id);
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
