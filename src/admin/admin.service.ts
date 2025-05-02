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

  async findAllEventsByUserType(userType: string): Promise<any>{
    const query = `
      SELECT id,userEmail,eventName,eventDate,eventId,numSeats,modeOfTravel,vehicleDetails,idProof,orgRequestLetter,status
      FROM event
      WHERE userType = ?
      ORDER BY event.eventDate DESC
    `;

    const allEvents = await this.eventRepository.query(query, [userType]);
    return allEvents;
  }

  async updateQueryData(id: number,  eventId:number, eventName:string, userEmail:string, status:string): Promise<any>{
    const query = `
      UPDATE event
      SET status = ?
      WHERE id = ? 
        AND eventId = ? 
        AND eventName = ? 
        AND userEmail = ?;

    `;

    const allEvents = await this.eventRepository.query(query, [status,id,eventId,eventName,userEmail]);
    return allEvents;
  }

  async updateEventData(eventid: number, title: string, location: string, date:string, image:string){
    const EventUpdateQuery = `
      UPDATE admin
      SET
      title = ? ,
      location = ? ,
      image = ? ,
      date = ?
      WHERE eventid = ?
    `;

    const updateEvents = await this.eventRepository.query(EventUpdateQuery, [title,location,image,date,eventid]);
    return updateEvents;
  }

  async addEventData(title: string, location: string, date: string, image: string) {
    const addEventQuery = `
      INSERT INTO admin (title, location, image, date)
      VALUES (?, ?, ?, ?)
    `;
    const addEvent = await this.eventRepository.query(addEventQuery, [title, location, image, date]);
    return addEvent;  
  }

  async deleteEvent(eventid: number) {
    const query = `DELETE FROM admin WHERE eventid = ?`;
    return this.eventRepository.query(query, [eventid]);
  }
}