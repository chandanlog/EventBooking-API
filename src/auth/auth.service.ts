import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/user.entity";
import { FirebaseUser } from "../users/firebase-user.entity";
import { RegisterDto, LoginDto, UserDto } from "./dto/auth.dto";
import * as jwt from 'jsonwebtoken';
import e from "express";


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(FirebaseUser)
    private firebaseUserRepository: Repository<FirebaseUser>,

    private jwtService: JwtService
  ) {}

  // ✅ User Registration
  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { fullName, email, password } = registerDto;

    // Check if email already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save User
    const createdAt = new Date();
    const newUser = this.userRepository.create({ fullName, email, password: hashedPassword, createdAt});
    await this.userRepository.save(newUser);

    return { message: "User registered successfully" };
  }

  // ✅ User Login (Fixed Password Verification)
  async login(loginDto: LoginDto): Promise<{ accessToken: string, email: string }> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    // Verify Password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid password");
    }

    // Generate JWT Token
    const payload = { id: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken: accessToken, email: user.email };
  }

  // ✅ Validate User (For Passport Local Strategy)
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException("Invalid user");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid password");
    }

    return user;
  }

  decodeToken(token: string): any {
    try {
      const decoded = jwt.decode(token, { complete: true });
      if (!decoded) {
        throw new Error('Invalid token');
      }
      return decoded.payload; // This will return the decoded JWT payload
    } catch (error) {
      throw new Error('Failed to decode token: ' + error.message);
    }
  }

  // ✅ Store Google User (Firebase login)
  async storeUser(userDto: UserDto) {
  const {
    identifier,
    providers,
    created,
    signedIn,
    userUID,
    userName,
    photoURL,
  } = userDto;

  const existing = await this.firebaseUserRepository.findOne({
    where: { userUID },
  });

  if (existing) {
    existing.signedIn = signedIn;
    existing.providers = providers.join(',');
    existing.photoURL = photoURL;
    await this.firebaseUserRepository.save(existing);
    return { message: 'Firebase user updated' };
  }

  const newUser = this.firebaseUserRepository.create({
    identifier,
    providers: providers.join(','),
    created,
    signedIn,
    userUID,
    userName,
    photoURL,
  });

  await this.firebaseUserRepository.save(newUser);
  return { message: 'Firebase user saved successfully' };
}
}
