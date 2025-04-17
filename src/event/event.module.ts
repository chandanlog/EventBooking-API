import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventFormService } from './event.service';
import { EventFormController } from './event.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [EventFormController],
  providers: [EventFormService],
})
export class EventFormModule {}
