import { Injectable } from '@nestjs/common';
import { EventType } from 'src/types/events/EventType';

@Injectable()
export class EventsService {
  create(): EventType {
    return {
      id: 0,
      name: 'test',
      total_seats: 4,
    };
  }
}
