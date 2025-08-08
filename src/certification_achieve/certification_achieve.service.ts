import { Injectable } from '@nestjs/common';
import { CreateCertificationAchieveDto } from './dto/create-certification_achieve.dto';
import { UpdateCertificationAchieveDto } from './dto/update-certification_achieve.dto';

@Injectable()
export class CertificationAchieveService {
  create(createCertificationAchieveDto: CreateCertificationAchieveDto) {
    return 'This action adds a new certificationAchieve';
  }

  findAll() {
    return `This action returns all certificationAchieve`;
  }

  findOne(id: number) {
    return `This action returns a #${id} certificationAchieve`;
  }

  update(id: number, updateCertificationAchieveDto: UpdateCertificationAchieveDto) {
    return `This action updates a #${id} certificationAchieve`;
  }

  remove(id: number) {
    return `This action removes a #${id} certificationAchieve`;
  }
}
