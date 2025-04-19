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

    // ✅ New function to upload documents and update status
    async uploadDocuments(
      userEmail: string,
      eventId: number,
      userType: string,
      idProof?: Buffer,
      orgRequestLetter?: Buffer,
    ): Promise<Event | null> {
      const existingEvent = await this.eventRepository.findOne({
        where: { userEmail, eventId, userType },
      });
  
      if (!existingEvent) {
        return null;
      }
  
      // Update fields if provided
      if (idProof) existingEvent.idProof = idProof;
      if (orgRequestLetter) existingEvent.orgRequestLetter = orgRequestLetter;
  
      // Set status to upload document
      existingEvent.status = 'upload document';
  
      return this.eventRepository.save(existingEvent);
    }
}
