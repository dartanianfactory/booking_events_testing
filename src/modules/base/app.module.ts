import { Module } from '@nestjs/common';
import { AppController } from '../../controllers/base/app.controller';
import { AppService } from '../../services/base/app.service';
import { PrismaModule } from '../database/prisma.module';
import { SeedModule } from '../database/seed.module';
import { AuthModule } from '../auth/auth.module';
import { AuthController } from 'src/controllers/auth/auth.controller';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [PrismaModule, SeedModule, AuthModule, BookingsModule],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
