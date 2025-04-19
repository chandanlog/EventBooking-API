import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/user.entity";
import { RegisterDto, LoginDto } from "./dto/auth.dto";
import * as jwt from 'jsonwebtoken';
import e from "express";


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
    const newUser = this.userRepository.create({ fullName, email, password: hashedPassword });
    await this.userRepository.save(newUser);

    return { message: "User registered successfully" };
  }

  // ✅ User Login (Fixed Password Verification)
  async login(loginDto: LoginDto): Promise<{ accessToken: string, email: string }> {
    const { email, password } = loginDto;

    console.log("Received Email:", email);
    console.log("Received Password:", password);

    // Find user by email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    console.log("Stored Hashed Password:", user.password);

    // Verify Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", isPasswordValid);

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
}
