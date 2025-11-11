import { Module } from '@nestjs/common';
import { AppController } from '../../controllers/base/app.controller';
import { AppService } from '../../services/base/app.service';
import { PrismaModule } from '../database/prisma.module';
import { SeedModule } from '../database/seed.module';

@Module({
  imports: [PrismaModule, SeedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
