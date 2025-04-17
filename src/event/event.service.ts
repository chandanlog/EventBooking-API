import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventFormDto } from './create-event.dto';

@Injectable()
export class EventFormService {
  constructor(
    @InjectRepository(Event)
    private formRepo: Repository<Event>,
  ) {}

  async create(formDto: CreateEventFormDto): Promise<Event> {
    const newForm = this.formRepo.create(formDto);
    return await this.formRepo.save(newForm);
  }

  async findAll(): Promise<Event[]> {
    return this.formRepo.find();
  }
}
