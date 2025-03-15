import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from './dto/register-request.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from 'src/lib/decorators/public.decorator';
import { LoginRequestDto } from './dto/login-request.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginBody: LoginRequestDto, @Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  async register(@Body() registerBody: RegisterRequestDto) {
    return this.authService.register(registerBody);
  }

  @Post('logout')
  async logout(@Request() req) {
    console.log(req.user);
  }
}
