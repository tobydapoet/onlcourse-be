import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CertificationAchieveService } from './certification_achieve.service';
import { CreateCertificationAchieveDto } from './dto/create-certification_achieve.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';

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
    return this.certificationAchieveService.findAll();
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
