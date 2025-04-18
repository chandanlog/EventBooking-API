import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventFormDto } from './create-event.dto';
import { Event } from './event.entity';

@Injectable()
export class EventFormService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async createOrUpdateEvent(createEventFormDto: CreateEventFormDto): Promise<Event> {
    const { userEmail, eventName} = createEventFormDto;
  
    const existingEvent = await this.eventRepository.findOne({
      where: { userEmail, eventName },
    });
  
    if (existingEvent && existingEvent.status !== 'submitted') {
      // Update existing entry
      Object.assign(existingEvent, {
        ...createEventFormDto,
        status: 'event details', // set internally
      });
      return await this.eventRepository.save(existingEvent);
    } else {
      // Create new entry with status
      const newEvent = this.eventRepository.create({
        ...createEventFormDto,
        status: 'event details', // set internally
      });
      return await this.eventRepository.save(newEvent);
    }
  }
  

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find();
  }
}
