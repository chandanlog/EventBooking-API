import { Controller, Post, Body } from '@nestjs/common';
import { AdminUserService } from './admin-login.service';
import { LoginDto } from './dto/login.dto';

@Controller('admin-user')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    return this.adminUserService.validateLogin(email, password);
  }
}