import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { CreateEventFormDto } from './admin.event.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly eventRepository: Repository<Admin>,
  ) {}

  async create(dto: CreateEventFormDto): Promise<Admin> {
    const newEvent = this.eventRepository.create(dto);
    return await this.eventRepository.save(newEvent);
  }

  async findAll(): Promise<Admin[]> {
    return await this.eventRepository.find();
  }
}
