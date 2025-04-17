import { Strategy } from 'passport-local';  // Import passport-local strategy
import { PassportStrategy } from '@nestjs/passport';  // Base class for Passport strategies
import { Injectable, UnauthorizedException } from '@nestjs/common';  // NestJS decorators and exceptions
import { AuthService } from '../auth.service';  // Import AuthService to handle user validation

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // 'usernameField' tells Passport to treat 'email' as the username field
    super({ usernameField: 'email' });
  }

  // Validate the user credentials
  async validate(email: string, password: string): Promise<any> {
    // Use AuthService to validate the user (you need to define the logic inside AuthService)
    const user = await this.authService.validateUser(email, password);
    
    // If user is not found or credentials are incorrect, throw an UnauthorizedException
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Return the user object if valid credentials
    return user;
  }
}
