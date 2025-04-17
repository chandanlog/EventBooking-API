import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';  // Import User entity
import { UserModule } from '../users/user.module';  // Import UserModule for reusable logic related to users
import { JwtModule } from '@nestjs/jwt';  // Import JwtModule for JWT functionality
import { PassportModule } from '@nestjs/passport';  // Import PassportModule to enable Passport.js strategies
import { JwtStrategy } from './strategies/jwt.strategy';  // Import JwtStrategy for JWT-based authentication
import { LocalStrategy } from './strategies/local.strategy';  // Import LocalStrategy for email/password authentication

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),  // Integrate User entity with TypeORM for database operations
    UserModule,  // Import UserModule to manage user-related services
    PassportModule,  // Enable Passport strategies for authentication
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_secret_key',  // Use environment variable or fallback secret key
      signOptions: { expiresIn: '1h' },  // Set JWT expiration time to 1 hour
    }),
  ],
  providers: [
    AuthService,  // AuthService to handle authentication logic
    JwtStrategy,  // JwtStrategy to handle JWT-based authentication
    LocalStrategy,  // LocalStrategy to handle email/password authentication
  ],
  controllers: [AuthController],  // AuthController to handle authentication routes like login and registration
  exports: [AuthService],  // Export AuthService if needed by other modules
})
export class AuthModule {}
