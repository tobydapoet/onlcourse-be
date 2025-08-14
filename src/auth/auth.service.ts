import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
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
import { CreateGoogleUser } from 'src/user/dto/create-google.dto';
import { RedisClientType } from 'redis';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private teacherService: TeacherService,
    private jwtService: JwtService,
    private mailService: MailService,
    @Inject(refreshConfig.KEY)
    private refreshConfiguration: ConfigType<typeof refreshConfig>,
    @InjectRepository(Auth) private authRepo: Repository<Auth>,
    @Inject('REDIS_STORAGE') private readonly redistStorage: RedisClientType,
  ) {}

  async validateUser(email: string, password: string) {
    const existing = await this.userService.findByEmail(email);
    if (!existing) {
      throw new Error('email or passwrod is incorrect!');
    }
    const isMatchPassword = await bcrypt.compare(password, existing?.password);
    if (!isMatchPassword) {
      throw new Error('email or passwrod is incorrect!');
    }
    return existing;
  }

  async validateWithKey(id: string) {
    const existing = await this.userService.findOne(id);
    if (!existing) {
      throw new UnauthorizedException("Can't find user!");
    }

    await this.redistStorage.del(`session:all`);

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

  async validateGoolgeAccount(googleAccount: CreateGoogleUser) {
    const account = await this.userService.findByEmail(googleAccount.email);
    if (account) return account;
    return await this.userService.createWithGoogle(googleAccount);
  }

  async logout(id: string) {
    await this.redistStorage.del(`session:${id}`);
    return this.authRepo.delete({ id });
  }

  async findAll() {
    const cachedKey = `session:all`;
    const cached = await this.redistStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const users = await this.authRepo.find();
    await this.redistStorage.set(cachedKey, JSON.stringify(users), {
      EX: 60 * 5,
    });
    return users;
  }

  async findOne(id: string) {
    const cachedKey = `user:${id}`;
    const cached = await this.redistStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const user = await this.authRepo.findOne({ where: { id } });
    await this.redistStorage.set(cachedKey, JSON.stringify(user), {
      EX: 60 * 5,
    });
    return user;
  }

  async sendOtp(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user || !user.password)
      throw new UnauthorizedException(
        "Can't find this email or this email login with other method",
      );
    const otp = Math.floor(10000 + Math.random() * 900000).toString();
    await this.redistStorage.set(`otp:${email}`, otp, { EX: 60 * 5 });

    await this.mailService.sendEmail({
      text: `Your otp is ${otp} (expired in 5 minutes!)`,
      sub: 'OTP change password!',
      to: email,
    });
  }

  async resetPassword(email: string, otp: string, newPass: string) {
    const cachedKey = `otp:${email}`;
    const storeOtp = await this.redistStorage.get(cachedKey);
    if (!storeOtp || storeOtp !== otp) {
      throw new UnauthorizedException('Invalid otp or otp was expire!');
    }
    const hashed = await bcrypt.hash(newPass, 10);
    await this.userService.changePassword(email, hashed);
    await this.redistStorage.del(cachedKey);
    return 'Change password success!';
  }
}
