import { Module } from '@nestjs/common';
import { SeedService } from 'src/services/database/seed.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
