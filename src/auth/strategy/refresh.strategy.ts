import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import refreshConfig from '../config/refresh.config';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload } from '../types/jwtPayload';

export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh_jwt') {
  constructor(
    @Inject(refreshConfig.KEY)
    private refreshConfiguration: ConfigType<typeof refreshConfig>,
    private autService: AuthService,
  ) {
    if (!refreshConfiguration.secret) {
      throw new Error('JWT secret is not defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: refreshConfiguration.secret,
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    const refresh_token = req
      .get('authorization')
      ?.replace('Bearer', '')
      .trim();
    if (!refresh_token) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return this.autService.validateRefreshToken(payload.sub, refresh_token);
  }
}
