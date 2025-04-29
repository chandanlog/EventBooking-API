import { IsString, IsEmail, MinLength, IsDateString } from 'class-validator';

export class RegisterDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsDateString()
  createdAt: string;
}
