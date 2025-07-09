import { IsArray, IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}

// 🔹 For Google/Firebase Login
export class UserDto {
  @IsEmail()
  identifier: string;

  @IsArray()
  @IsString({ each: true })
  providers: string[];

  @IsString()
  created: string; // YYYY-MM-DD

  @IsString()
  signedIn: string;

  @IsString()
  userUID: string;

  @IsString()
  userName: string;

  @IsString()
  photoURL: string;
}
