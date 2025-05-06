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
      SELECT id,userEmail,organizationName,eventName,eventDate,eventId,numSeats,modeOfTravel,vehicleDetails,idProof,orgRequestLetter,status
      FROM event
      WHERE userType = ?
      ORDER BY event.createdAt DESC
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

  async getEventReportData(){
    const EventReportQuery = `
    SELECT 
    MONTHNAME(e.createdAt) AS month,
    e.eventName AS name,
    COUNT(m.id) AS attendees,
    e.userType AS userType,
    e.state,
    e.modeOfTravel AS vehicleType
    FROM event e
    LEFT JOIN member m ON e.eventId = m.eventId
    WHERE e.createdAt <= NOW()
    GROUP BY MONTHNAME(e.createdAt), e.eventName, e.userType, e.state, e.modeOfTravel
    `;
    const addEvent = await this.eventRepository.query(EventReportQuery);
    return addEvent;
  }
  async getFilteredReportData(event:string, year:string, month:string, userType:string){
    let query = `
      SELECT 
        event.userType,
        event.organizationName,
        event.eventName, 
        event.eventLoaction, 
        event.eventDate, 
        event.numSeats, 
        event.eventId, 
        event.status, 
        event.ticketNo, 
        member.*
      FROM event
      JOIN member 
        ON member.userEmail = event.userEmail 
        AND member.eventId = event.eventId
        AND member.userType = event.userType
        AND member.organizationName = event.organizationName
      WHERE event.status IN ('submitted', 'approve', 'reject')
     
    `;
    const params: any[] = [];
    if (event) {
      query += ` AND event.eventName = ?`;
      params.push(event);
    }

    if (year) {
      query += ` AND YEAR(event.createdAt) = ?`;
      params.push(year);
    }

    if (month) {
      query += ` AND MONTH(event.createdAt) = ?`;
      params.push(month);
    }

    if (userType) {
      query += ` AND event.userType = ?`;
      params.push(userType);
    }

    query += ` ORDER BY event.createdAt DESC`;

    const filteredEvents = await this.eventRepository.query(query, params);
    return filteredEvents;
  }
  
}