import { Controller, Post } from '@nestjs/common';
import { EventsService } from 'src/services/events/events.service';
import type { EventType } from 'src/types/events/EventType';

@Controller('/api/bookings/reserve')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('add')
  getEvents(): EventType {
    return this.eventsService.create();
  }
}
