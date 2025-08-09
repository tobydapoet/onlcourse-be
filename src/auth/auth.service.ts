import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './types/jwtPayload';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { TeacherService } from 'src/teacher/teacher.service';
import { Role } from './enums/role.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import refreshConfig from './config/refresh.config';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private teacherService: TeacherService,
    private jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshConfiguration: ConfigType<typeof refreshConfig>,
    @InjectRepository(Auth) private authRepo: Repository<Auth>,
  ) {}

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  async validateUser(indentifier: string, password: string) {
    const existing = await this.userService.findByIndentifier(indentifier);
    if (!existing) {
      throw new Error('identifier or passwrod is incorrect!');
    }
    const isMatchPassword = await bcrypt.compare(password, existing?.password);
    if (!isMatchPassword) {
      throw new Error('identifier or passwrod is incorrect!');
    }
    return existing;
  }

  async validateWithKey(id: string) {
    const existing = await this.userService.findOne(id);
    if (!existing) {
      throw new UnauthorizedException("Can't find user!");
    }

    const session = this.authRepo.create({
      user: { id: existing.id },
      hashedToken: '',
    });

    const savedSession = await this.authRepo.save(session);
    const sessionWithUser = await this.authRepo.findOne({
      where: { id: savedSession.id },
    });
    if (!sessionWithUser) {
      throw new UnauthorizedException('invalid session!');
    }
    let payload: JwtPayload = {
      id: sessionWithUser.user.id,
      sub: sessionWithUser.id,
      role: sessionWithUser.user.role,
    };

    if (sessionWithUser.user.role === Role.TEACHER) {
      const teacherExsiting = await this.teacherService.findByUser(
        sessionWithUser.user.id,
      );
      payload.teacher_role = teacherExsiting.role_type;
    }

    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(
      payload,
      this.refreshConfiguration,
    );

    const hashedToken = await argon2.hash(refresh_token);
    ((savedSession.hashedToken = hashedToken),
      await this.authRepo.save(savedSession));

    return { access_token, refresh_token };
  }

  async validateRefreshToken(id: string, refresh_token: string) {
    const existingSession = await this.authRepo.findOne({ where: { id } });
    if (!existingSession) {
      throw new UnauthorizedException("Can't find this session!");
    }
    const isMatchToken = await argon2.verify(
      existingSession.hashedToken,
      refresh_token,
    );
    if (!isMatchToken) {
      throw new UnauthorizedException('Invalid token!');
    }
    return existingSession.id;
  }

  async refreshToken(id: string) {
    const session = await this.authRepo.findOne({ where: { id } });
    if (!session) {
      throw new UnauthorizedException();
    }

    let payload: JwtPayload = {
      id: session.user.id,
      role: session.user.role,
      sub: session.id,
    };
    if (session.user.role === Role.TEACHER) {
      const teacher = await this.teacherService.findByUser(session.user.id);
      payload.teacher_role = teacher.role_type;
    }
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
