import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CacheModule } from 'src/cache/cache.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), CacheModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
