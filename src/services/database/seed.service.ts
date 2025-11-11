import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(private prisma: PrismaService) {
    this.prisma = new PrismaService();
  }

  async seed() {
    try {
      // Временное решение
      if (process.env.DATABASE_NEED_SEED !== 'false') {
        console.log('Seeding is start!');

        await this.seedUsers();
        await this.seedEvents();

        console.log('Seeding is done!');
      } else {
        console.log('Database is full!');
      }
      return true;
    } catch (error) {
      console.log('Seeding error:', (error as Error).message);
      console.log('Error stack:', (error as Error).stack);
      return false;
    }
  }

  async seedUsers() {
    try {
      console.log('User seeder start!');

      const existingUsers = await this.prisma.user.findMany();
      if (existingUsers.length > 0) {
        console.log('Users already exist, skipping user seeding');
        return true;
      }

      const saltRounds = parseInt(process.env.PASSWORD_SALT || '10');
      const hash = await bcrypt.hash('123123', saltRounds);

      await this.prisma.user.createMany({
        data: [
          {
            user_id: 'admin1',
            email: 'admin@test.com',
            name: 'Admin',
            password: hash,
          },
          {
            user_id: 'user1',
            email: 'user@test.com',
            name: 'User',
            password: hash,
          },
        ],
      });

      console.log('User seeder done!');
      return true;
    } catch (error) {
      console.log('User seeder error:', (error as Error).message);
      console.log('User seeder error stack:', (error as Error).stack);
      return false;
    }
  }

  async seedEvents() {
    try {
      console.log('Event seeder start!');

      const existingEvents = await this.prisma.event.findMany();
      console.log(`Found ${existingEvents.length} existing events`);

      if (existingEvents.length > 0) {
        console.log('Events already exist, skipping event seeding');
        return true;
      }

      const adminUser = await this.prisma.user.findFirst({
        where: { email: 'admin@test.com' },
      });

      if (!adminUser) {
        throw new Error('Admin user not found for event seeding');
      }

      await this.prisma.event.createMany({
        data: [
          {
            name: 'Concert',
            total_seats: 100,
            user_id: adminUser.user_id,
          },
          {
            name: 'Conference',
            total_seats: 50,
            user_id: adminUser.user_id,
          },
          {
            name: 'Workshop',
            total_seats: 30,
            user_id: adminUser.user_id,
          },
        ],
      });

      console.log('Event seeder done!');
      return true;
    } catch (error) {
      console.log('Event seeder error:', (error as Error).message);
      return false;
    }
  }
}
