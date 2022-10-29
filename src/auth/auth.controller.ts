import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthDto, UserData } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  signIn(@Body('user') userData: UserData) {
    return this.authService.signIn(userData);
  }

  @Post('signUp')
  signUp(@Body('user') userData: UserData) {
    return this.authService.signUp(userData);
  }
}
