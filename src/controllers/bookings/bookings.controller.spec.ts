import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from 'src/services/bookings/bookings.service';

describe('BookingsController', () => {
  let controller: BookingsController;

  const mockBookingsService = {
    createBooking: jest.fn(),
    getUserBookings: jest.fn(),
    getEventBookings: jest.fn(),
    cancelBooking: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createBooking', () => {
    it('should create booking successfully', async () => {
      const bookingData = { event_id: 1 };
      const user = { id: 1 };
      const mockBooking = {
        id: 1,
        event_id: 1,
        user_id: '1',
        created_at: '2023-01-01T00:00:00.000Z',
      };

      mockBookingsService.createBooking.mockResolvedValue(mockBooking);

      const result = await controller.createBooking({ user }, bookingData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Seat booked successfully');
      expect(result.booking).toEqual(mockBooking);
    });
  });

  describe('getUserBookings', () => {
    it('should return user bookings', async () => {
      const user = { id: 1 };
      const mockBookings = [
        {
          id: 1,
          event_id: 1,
          user_id: '1',
          created_at: '2023-01-01T00:00:00.000Z',
        },
      ];

      mockBookingsService.getUserBookings.mockResolvedValue(mockBookings);

      const result = await controller.getUserBookings({ user });

      expect(result.success).toBe(true);
      expect(result.bookings).toEqual(mockBookings);
    });
  });
});
