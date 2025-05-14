import { Body, Controller, Get, Post, Put, Delete, Param, HttpException, HttpStatus, Query} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateEventFormDto } from './admin.event.dto';
import { get } from 'http';
import { join } from 'path';
import * as fs from 'fs';
import { DistrictsData } from '../interfaces/district.interface';

@Controller('admin')
export class EventFormController {
  constructor(private readonly AdminService: AdminService) {}
   private districts: DistrictsData = JSON.parse(
    fs.readFileSync(join(__dirname, '../../data/statesDistricts.json'), 'utf-8'),
  ) as DistrictsData;

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

  @Get('getEventReport')
  async getReport() {
    return await this.AdminService.getEventReportData();
  }

  @Get('filteredData')
  async getFilteredReport(
    @Query('event') event: string,
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('userType') userType: string,
  ) {
    // Pass query params to service
    return await this.AdminService.getFilteredReportData(event, year, month, userType);
  }

  // ✅ GET all unique state names
  @Get('location/states')
  getStates() {
    const statesSet = new Set<string>();
    this.districts.districts.forEach((item) => {
      statesSet.add(item.state);
    });

    return Array.from(statesSet);
  }

  // ✅ GET all district names by state name
  @Get('location/districts/:stateName')
  getDistrictsByState(@Param('stateName') stateName: string) {
    const districts = this.districts.districts.filter(
      (d) => d.state.toLowerCase() === stateName.toLowerCase(),
    );

    if (districts.length === 0) {
      throw new HttpException('State not found', HttpStatus.NOT_FOUND);
    }

    return districts.map((d) => d.district);
  }
}
