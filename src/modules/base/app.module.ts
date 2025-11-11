import { Module } from '@nestjs/common';
import { AppController } from '../../controllers/base/app.controller';
import { AppService } from '../../services/base/app.service';
import { PrismaModule } from '../database/prisma.module';
import { SeedModule } from '../database/seed.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, SeedModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
