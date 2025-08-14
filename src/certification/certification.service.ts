import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Certification } from './entities/certification.entity';
import { Repository } from 'typeorm';
import { UploadService } from 'src/upload/upload.service';
import { RedisClientType } from 'redis';

@Injectable()
export class CertificationService {
  constructor(
    @InjectRepository(Certification)
    private cerificationRepo: Repository<Certification>,
    private uploadService: UploadService,
    @Inject('REDIS_STORAGE') private cacheStorage: RedisClientType,
  ) {}

  async create(coursed_id: string, file: Express.Multer.File) {
    const fileUploaded = await this.uploadService.uploadFile(
      file,
      'certification',
      'raw',
    );
    if (!fileUploaded) {
      throw new Error("Can't upload this image");
    }
    const newCertification = this.cerificationRepo.create({
      course: { id: coursed_id },
      file_url: fileUploaded.url,
    });
    const savedCerification =
      await this.cerificationRepo.save(newCertification);
    await this.cacheStorage.del('certification:all');
    return savedCerification;
  }

  async findAll() {
    const cachedKey = `certification:all`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const allCerifications = await this.cerificationRepo.find();
    await this.cacheStorage.set(cachedKey, JSON.stringify(allCerifications), {
      EX: 60 * 5,
    });
    return allCerifications;
  }

  async findOne(id: string) {
    const cachedKey = `certification:${id}`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const certification = await this.cerificationRepo.findOne({
      where: { id },
    });
    await this.cacheStorage.set(cachedKey, JSON.stringify(certification), {
      EX: 60 * 5,
    });
    return certification;
  }

  async update(id: string, coursed_id?: string, file?: Express.Multer.File) {
    const existingCerification = await this.cerificationRepo.findOne({
      where: { id },
    });
    if (!existingCerification) {
      throw new Error("Can't find this certification!");
    }
    let file_url = existingCerification.file_url;
    if (file) {
      const uploadedFile = await this.uploadService.uploadFile(
        file,
        'certification',
        'raw',
      );
      file_url = uploadedFile.url;
    }
    const updatedCertification = await this.cerificationRepo.update(
      { id },
      { course: { id: coursed_id }, file_url },
    );
    if (updatedCertification) {
      await this.cacheStorage.del('certification:all');
      await this.cacheStorage.del(`certification:${id}`);
    }
    return this.cerificationRepo.findOne({ where: { id } });
  }
}
