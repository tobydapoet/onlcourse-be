import { Inject, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-google-oauth20';
import googleConfig from '../config/google.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { ProvideType } from 'src/user/types/provider.type';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(googleConfig.KEY)
    googleCofiguration: ConfigType<typeof googleConfig>,
    private authService: AuthService,
  ) {
    if (!googleCofiguration) {
      throw new Error('Invalid Google OAuth configuration');
    }
    super({
      clientID: googleCofiguration.clientID!,
      clientSecret: googleCofiguration.clientSecret!,
      callbackURL: googleCofiguration.callbackURL!,
      scope: ['email', 'profile'],
    });
  }

  async validate(_: string, __: string, profile: any) {
    const user = await this.authService.validateGoolgeAccount({
      email: profile.emails?.[0]?.value,
      avatar_url: profile.photos?.[0].value ?? null,
      name: profile.displayName ?? '',
      provider: profile.id,
      provider_type: ProvideType.GOOGLE,
    });
    if (user) {
      const loginRes = await this.authService.validateWithKey(user.id);
      return loginRes;
    }
    return null;
  }
}
