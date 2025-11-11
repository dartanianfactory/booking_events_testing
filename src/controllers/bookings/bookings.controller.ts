import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  UseGuards,
  Request,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookingsService } from 'src/services/bookings/bookings.service';

@Controller('/api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('reserve')
  async createBooking(
    @Request() req,
    @Body() bookingData: { event_id: number },
  ) {
    try {
      const booking = await this.bookingsService.createBooking(
        bookingData.event_id,
        req.user.user_id,
      );

      return {
        success: true,
        message: 'Seat booked successfully',
        booking,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message as string,
      };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-bookings')
  async getUserBookings(@Request() req) {
    try {
      const bookings = await this.bookingsService.getUserBookings(
        req.user.user_id,
      );

      return {
        success: true,
        bookings,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message as string,
      };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('event/:eventId')
  async getEventBookings(@Param('eventId', ParseIntPipe) eventId: number) {
    try {
      const eventBookings =
        await this.bookingsService.getEventBookings(eventId);

      return {
        success: true,
        ...eventBookings,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('cancel/:bookingId')
  async cancelBooking(
    @Request() req,
    @Param('bookingId', ParseIntPipe) bookingId: number,
  ) {
    try {
      const result = await this.bookingsService.cancelBooking(
        bookingId,
        req.user.user_id,
      );

      return result;
    } catch (error) {
      return {
        success: false,
        message: error.message as string,
      };
    }
  }
}