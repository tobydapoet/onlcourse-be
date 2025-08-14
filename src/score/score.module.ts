import { Module } from '@nestjs/common';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from './entities/score.entity';
import { QuizResponseModule } from 'src/quiz_response/quiz_response.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Score]), QuizResponseModule, CacheModule],
  controllers: [ScoreController],
  providers: [ScoreService],
})
export class ScoreModule {}
