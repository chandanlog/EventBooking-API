// src/admin/admin.event.dto.ts

import { IsString, IsNotEmpty } from 'class-validator';

export class CreateEventFormDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  image: string;
}
