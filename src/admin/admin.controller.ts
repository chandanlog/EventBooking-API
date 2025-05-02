import { Body, Controller, Get, Post, Put, Delete, Param, HttpException, HttpStatus} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateEventFormDto } from './admin.event.dto';

@Controller('admin')
export class EventFormController {
  constructor(private readonly AdminService: AdminService) {}

  @Post()
  async createEvent(@Body() createEventDto: CreateEventFormDto) {
    return await this.AdminService.create(createEventDto);
  }

  @Get()
  async getAllEvents() {
    return await this.AdminService.findAll();
  }

  @Post('adminApprove')
  async getEventDataByUserType(@Body() body: { userType: string }) {
    const { userType } = body;
    if (!userType) {
      throw new Error("UserType is required to fetch event data.");
    }
    
    // Call the service method to retrieve event data by email
    return this.AdminService.findAllEventsByUserType(userType);
  }

  @Post('updateStatus')
  async getAdminAction(@Body() body: { id: string; eventId: string; eventName: string; userEmail:string, status:string}) {
    const { id, eventId, eventName, userEmail, status } = body;
    return this.AdminService.updateQueryData(Number(id),Number(eventId),eventName,userEmail,status);
  }

  @Put('updateEvent')
  async getUpdateEvents(@Body() body: { eventid: string; title: string; location: string; date:string, image:string }) {
    const { eventid, title, location, date, image } = body;
    return this.AdminService.updateEventData(Number(eventid),title,location,date,image);
  }

  @Post('addEvent')
  async getAddEvents(@Body() body: { title: string; location: string; date:string, image:string }) {
    const { title, location, date, image } = body;
    return this.AdminService.addEventData(title,location,date,image);
  }

  @Delete('deleteEvent/:eventid')
  async deleteEvent(@Param('eventid') eventid: string) {
    if (!eventid) {
      throw new HttpException('Event ID is required', HttpStatus.BAD_REQUEST);
    }
    return this.AdminService.deleteEvent(Number(eventid));
  }

}