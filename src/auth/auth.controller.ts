import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local/local.guard';
import { RefreshAuthGuard } from './guard/refresh-auth/refresh-auth.guard';
import { Public } from './decorator/public.decorator';
import { GoogleGuard } from './guard/google/google.guard';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthMapper } from './mappers/auth.mapper';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req) {
    return this.authService.validateWithKey(req.user.id);
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refresh(@Req() req) {
    return this.authService.refreshToken(req.user);
  }

  @Public()
  @UseGuards(GoogleGuard)
  @Get('google/login')
  loginGoogle(@Req() req) {
    return req.user;
  }

  @Public()
  @UseGuards(GoogleGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    const response = await this.authService.validateWithKey(req.id);
    res.redirect(`http://localhost:4000token=${response.access_token}`);
  }

  @Delete(':id')
  logout(@Param('id') id: string) {
    return this.authService.logout(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AuthResponseDto | null> {
    const session = await this.authService.findOne(id);
    return session ? AuthMapper.toResponse(session) : null;
  }

  @Public()
  @Get('otp/:email')
  sendOtp(@Param('email') email: string) {
    return this.authService.sendOtp(email);
  }

  @Public()
  @Post('reset-password')
  resetPassword(@Body() body: { email: string; otp: string; newPass: string }) {
    const { email, otp, newPass } = body;
    return this.authService.resetPassword(email, otp, newPass);
  }
}
