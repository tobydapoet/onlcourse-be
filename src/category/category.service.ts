import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { RedisClientType } from '@redis/client';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @Inject('REDIS_STORAGE') private cacheStorage: RedisClientType,
  ) {}

  private async clearCategoryCache() {
    const keys = await this.cacheStorage.keys('category:page:*');
    if (keys.length > 0) {
      await this.cacheStorage.del(keys);
    }
  }

  async create(name: string) {
    const newCategory = this.categoryRepo.create({ name });
    const saved = await this.categoryRepo.save(newCategory);
    if (saved) {
      await this.clearCategoryCache();
    }
    return saved;
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Category>> {
    const cachedKey = `category:page:${options.page}:limit:${options.limit}`;
    const cached = await this.cacheStorage.get(cachedKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const queryBuilder = this.categoryRepo.createQueryBuilder('category');

    const result = await paginate<Category>(queryBuilder, options);

    await this.cacheStorage.set(cachedKey, JSON.stringify(result), {
      EX: 60 * 5,
    });

    return result;
  }

  async findOne(id: number) {
    const cachedKey = `category:${id}`;
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
      await this.clearCategoryCache();
      await this.cacheStorage.del(`category:${id}`);
    }
    return updatedCategory;
  }

  async remove(id: number) {
    const deletedCategory = await this.categoryRepo.delete({ id });
    if (deletedCategory) {
      await this.clearCategoryCache();
    }
    return deletedCategory;
  }
}
