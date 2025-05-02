import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUser } from './entities/admin-login.entity';
import { AdminUserService } from './admin-login.service';
import { AdminUserController } from './admin-login.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AdminUser])],
  providers: [AdminUserService],
  controllers: [AdminUserController],
})
export class AdminUserModule {}