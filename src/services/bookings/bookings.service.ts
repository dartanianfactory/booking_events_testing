// src/services/bookings/bookings.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async createBooking(event_id: number, user_id: string) { // Измените на string
    const event = await this.prisma.event.findUnique({
      where: { id: event_id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { user_id: user_id }, // Ищем по user_id (string)
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentBookingsCount = await this.prisma.booking.count({
      where: { event_id },
    });

    if (currentBookingsCount >= event.total_seats) {
      throw new ConflictException('No available seats for this event');
    }

    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        event_id,
        user_id,
      },
    });

    if (existingBooking) {
      throw new ConflictException(
        'You have already booked a seat for this event',
      );
    }

    const booking = await this.prisma.booking.create({
      data: {
        event_id,
        user_id,
      },
    });

    return {
      id: booking.id,
      event_id: booking.event_id,
      user_id: booking.user_id,
      created_at: booking.created_at.toISOString(),
    };
  }

  async getUserBookings(user_id: string) {
    const bookings = await this.prisma.booking.findMany({
      where: { user_id },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            total_seats: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return bookings.map((booking) => ({
      id: booking.id,
      event_id: booking.event_id,
      user_id: booking.user_id,
      created_at: booking.created_at.toISOString(),
    }));
  }

  async getEventBookings(event_id: number) {
    const event = await this.prisma.event.findUnique({
      where: { id: event_id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const bookings = await this.prisma.booking.findMany({
      where: { event_id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      event: {
        id: event.id,
        name: event.name,
        total_seats: event.total_seats,
      },
      bookings: bookings.map((booking) => ({
        id: booking.id,
        user_id: booking.user_id,
        created_at: booking.created_at.toISOString(),
      })),
    };
  }

  async cancelBooking(booking_id: number, user_id: string) { // Измените на string
    const booking = await this.prisma.booking.findFirst({
      where: {
        id: booking_id,
        user_id,
      },
    });

    if (!booking) {
      throw new NotFoundException(
        'Booking not found or you do not have permission to cancel it'
      );
    }

    await this.prisma.booking.delete({
      where: { id: booking_id },
    });

    return {
      success: true,
      message: 'Booking cancelled successfully',
    };
  }
}
