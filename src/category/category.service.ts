import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { RedisClientType } from '@redis/client';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @Inject('REDIS_STORAGE') private cacheStorage: RedisClientType,
  ) {}
  async create(name: string) {
    const newCategory = await this.categoryRepo.insert({ name });
    if (newCategory) {
      await this.cacheStorage.del('category:all');
    }
    return newCategory;
  }

  async findAll() {
    const cachedKey = `category:all`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const allCategoroes = await this.categoryRepo.find();
    await this.cacheStorage.set(cachedKey, JSON.stringify(allCategoroes), {
      EX: 60 * 5,
    });
    return allCategoroes;
  }

  async findOne(id: number) {
    const cachedKey = `category:all`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const category = await this.categoryRepo.findOne({ where: { id } });
    await this.cacheStorage.set(cachedKey, JSON.stringify(category), {
      EX: 60 * 5,
    });
    return category;
  }

  async update(id: number, name: string) {
    const updatedCategory = await this.categoryRepo.update({ id }, { name });
    if (updatedCategory) {
      await this.cacheStorage.del('category:all');
      await this.cacheStorage.del(`category:${id}`);
    }
    return updatedCategory;
  }

  async remove(id: number) {
    const deletedCategory = await this.categoryRepo.delete({ id });
    if (deletedCategory) {
      await this.cacheStorage.del('category:all');
    }
    return deletedCategory;
  }
}
