import { Body, Controller, Get, Post } from '@nestjs/common';
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
}
