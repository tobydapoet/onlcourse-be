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
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LocalAuthGuard } from './guard/local/local.guard';
import { RefreshAuthGuard } from './guard/refresh-auth/refresh-auth.guard';
import { Public } from './decorator/public.decorator';
import { Role } from './enums/role.enum';
import { Roles } from './decorator/role.decorator';
import { TeacherPosition } from './decorator/teacher-type.decorator';
import { TeacherRole } from './enums/teacher-role';
import { GoogleGuard } from './guard/google/google.guard';

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
    console.log(req.user);
    return req.user;
  }

  @Public()
  @UseGuards(GoogleGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    const response = await this.authService.validateWithKey(req.id);
    res.redirect(`http://localhost:3000token=${response.access_token}`);
  }

  @Roles(Role.TEACHER)
  @TeacherPosition(TeacherRole.ADMIN)
  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Delete(':id')
  logout(@Param('id') id: string) {
    return this.authService.logout(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }
}
