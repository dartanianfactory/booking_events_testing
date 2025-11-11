import { Module } from '@nestjs/common';
import { BookingsController } from 'src/controllers/bookings/bookings.controller';
import { BookingsService } from 'src/services/bookings/bookings.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
