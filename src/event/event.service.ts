import { ConsoleLogger, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateEventFormDto } from './create-event.dto';
import { Event } from './event.entity';

@Injectable()
export class EventFormService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async createOrUpdateEvent(createEventFormDto: CreateEventFormDto): Promise<Event | undefined> {
    const { userEmail, eventName} = createEventFormDto;
  
    const existingEvent = await this.eventRepository.findOne({
      where: { userEmail, eventName },
    });
  
    if (existingEvent) {
      if (existingEvent.status === 'submitted' || existingEvent.status === 'approve') {
        throw new HttpException(
          'Already booked,Please check "Get Ticket" from the sidebar!',
          HttpStatus.BAD_REQUEST
        );
      } 
      else if (existingEvent && existingEvent.status !== 'submitted'  && existingEvent.status !== 'approve') {
      // Update existing entry
      Object.assign(existingEvent, {
        ...createEventFormDto,
        status: 'event details', // set internally
        createdAt: new Date(),
      });
      return await this.eventRepository.save(existingEvent);
      }
    } else {
      // Create new entry with status
      const newEvent = this.eventRepository.create({
        ...createEventFormDto,
        status: 'event details', // set internally
        createdAt: new Date(),
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
      existingEvent.createdAt = new Date();
      return this.eventRepository.save(existingEvent);
    }

    async saveQrCodeData(userEmail: string, eventId: number, qrCode: string, userType: string) {
      const event = await this.eventRepository.findOne({
        where: { eventId, userEmail, userType },
      });
  
      if (!event) {
        throw new Error('Event not found');
      }
  
      // Generate ticket prefix like TICKET-20250423
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const datePart = `${dd}${mm}${yyyy}`;      
      const prefix = `EVE-${datePart}${eventId}`;
      const todayTickets = await this.eventRepository.count({
        where: {
          ticketNo: Like(`${prefix}%`),
        },
      });
      const ticketNo = `${prefix}${String(todayTickets + 1).padStart(2, '0')}`;
      // Update the event
      event.qrCode = qrCode;
      event.status = 'submitted';
      event.ticketNo = ticketNo;
      event.createdAt = new Date();
      return await this.eventRepository.save(event);
    }
  
    async findAllSubmittedOrApprovedEventsByEmail(userEmail: string): Promise<any> {
      const query = `
        SELECT 
          event.userType, 
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
        WHERE event.userEmail = ?
        ORDER BY event.createdAt DESC
      `;
    
      const allEvents = await this.eventRepository.query(query, [userEmail]);
    
      // Check if any organization event is still in submitted state
      const orgPending = allEvents.find(
        (e) => e.userType === 'organization' && e.status === 'submitted'
      );
      // Admin Rejected
      const orgReject = allEvents.find(
        (e) => e.userType === 'organization' && e.status === 'reject'
      );
    
      // If organization event is pending approval, include message in the response
      if (orgPending) {
        const response = [
          { message: 'Wait for admin approval for your organization submission.' },
          ...allEvents.filter(
            (e) =>
              !(e.userType === 'organization' && e.status === 'submitted')
          ),
        ];
        return response;  // Return a single array including the message and approved events
      }

       // If Admin event is reject approval, include message in the response
      if (orgReject) {
        const response = [
          { message: 'We regret to inform you that your ticket has been rejected.' },
          ...allEvents.filter(
            (e) =>
              !(e.userType === 'organization' && e.status === 'reject')
          ),
        ];
        return response;  // Return a single array including the message 
      }
    
      // Otherwise, return valid submitted/approved events
      return allEvents.filter(
        (e) =>
          (e.userType === 'individual' && e.status === 'submitted') ||
          (e.userType === 'organization' && e.status === 'approve')
      );
    }
    
    
}
