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

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Roles(Role.TEACHER)
  @TeacherPosition(TeacherRole.ASSISTANT)
  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
