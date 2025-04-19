import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors,} from '@nestjs/common';
import { EventFormService } from './event.service';
import { CreateEventFormDto } from './create-event.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('event')
export class EventFormController {
  constructor(private readonly eventFormService: EventFormService) {}

  @Post()
  async submitForm(@Body() formDto: CreateEventFormDto) {
    return this.eventFormService.createOrUpdateEvent(formDto);
  }

  @Get()
  async getAllForms() {
    return this.eventFormService.findAll();
  }

  // New endpoint to upload and update documents for the event
  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'idProof', maxCount: 1 },
      { name: 'orgRequestLetter', maxCount: 1 },
    ]),
  )
  async uploadDocuments(
    @UploadedFiles()
    files: {
      idProof?: Express.Multer.File[];
      orgRequestLetter?: Express.Multer.File[];
    },
    @Body()
    body: {
      userEmail: string;
      eventId: number;
      userType: string;
    },
  ) {
    return this.eventFormService.uploadDocuments(
      body.userEmail,
      body.eventId,
      body.userType,
      files.idProof?.[0]?.buffer || undefined,
      files.orgRequestLetter?.[0]?.buffer || undefined,
    );
    
  }
}
