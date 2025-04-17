import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventFormService } from './event.service';
import { CreateEventFormDto } from './create-event.dto';

@Controller('event')
export class EventFormController {
  constructor(private readonly eventFormService: EventFormService) {}

  @Post()
  async submitForm(@Body() formDto: CreateEventFormDto) {
    return this.eventFormService.create(formDto);
  }

  @Get()
  async getAllForms() {
    return this.eventFormService.findAll();
  }
}
