import { User } from './../users/user.entity';
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterDto, LoginDto } from './dto/auth.dto'; // 👈 Import both RegisterDto and LoginDto

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
    console.log("🔥 Received request body:", loginDto); // Log full request
    return this.authService.login(loginDto);
  }
}
