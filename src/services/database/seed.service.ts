import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(private prisma: PrismaService) {}

  async seed() {
    try {
      //Временное решение
      if (process.env.DATABASE_NEED_SEED !== 'false') {
        console.log('Seeding is start!');

        await this.seedUsers();

        console.log('Seeding is done!');
      } else {
        console.log('Database is full!');
      }
      return true;
    } catch (error) {
      console.log((error as Error).message);
      return false;
    }
  }

  async seedUsers() {
    try {
      console.log('User seeder start!');

      const hash = await bcrypt.hash('123123', 1993);

      await this.prisma.user.createMany({
        data: [
          {
            id: 1,
            email: 'admin@test.com',
            name: 'Admin',
            password: hash,
          },
        ],
      });

      console.log('User seeder done!');
      return true;
    } catch (error) {
      console.log((error as Error).message);
      return false;
    }
  }
}
