import { NestFactory } from '@nestjs/core';
import { SeedModule } from 'src/modules/database/seed.module';
import { SeedService } from 'src/services/database/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(SeedModule);
  const seedService = app.get(SeedService);

  try {
    const result = await seedService.seed();
    if (result) {
      console.log('Seeding completed successfully!');
    } else {
      console.log('Seeding failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
