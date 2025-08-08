import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CertificationAchieveService } from './certification_achieve.service';
import { CreateCertificationAchieveDto } from './dto/create-certification_achieve.dto';
import { UpdateCertificationAchieveDto } from './dto/update-certification_achieve.dto';

@Controller('certification-achieve')
export class CertificationAchieveController {
  constructor(private readonly certificationAchieveService: CertificationAchieveService) {}

  @Post()
  create(@Body() createCertificationAchieveDto: CreateCertificationAchieveDto) {
    return this.certificationAchieveService.create(createCertificationAchieveDto);
  }

  @Get()
  findAll() {
    return this.certificationAchieveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.certificationAchieveService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCertificationAchieveDto: UpdateCertificationAchieveDto) {
    return this.certificationAchieveService.update(+id, updateCertificationAchieveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.certificationAchieveService.remove(+id);
  }
}
