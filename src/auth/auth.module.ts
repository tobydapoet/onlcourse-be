import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './strategy/local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { TeacherModule } from 'src/teacher/teacher.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import refreshConfig from './config/refresh.config';
import jwtConfig from './config/jwt.config';
import { RefreshStrategy } from './strategy/refresh.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guard/jwt-auth/jwt-auth.guard';
import { RoleGuard } from './guard/role/role.guard';
import { TeacherRoleGuard } from './guard/teacher_role/teacher_role.guard';
import { JwtStrategy } from './strategy/jwt.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import googleConfig from './config/google.config';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [
    UserModule,
    TeacherModule,
    CacheModule,
    TypeOrmModule.forFeature([Auth]),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshConfig),
    ConfigModule.forFeature(googleConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [refreshConfig, jwtConfig],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    RefreshStrategy,
    JwtStrategy,
    GoogleStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_GUARD,
      useClass: TeacherRoleGuard,
    },
  ],
})
export class AuthModule {}
