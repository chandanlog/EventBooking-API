import { User } from './../users/user.entity';
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterDto, LoginDto, UserDto } from './dto/auth.dto'; // 👈 Import both RegisterDto and LoginDto

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ✅ Register Route
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto); // Call the register function in the AuthService
  }

  // Login Route
  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("storeUser")
  async storeUser(@Body() userDto: UserDto) {
    return this.authService.storeUser(userDto);
  }
}
