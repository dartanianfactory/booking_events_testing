import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/modules/base/app.module';
import { SeedService } from 'src/services/database/seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const seedService = app.get(SeedService);
  await seedService.seed();

  await app.close();
  console.log('Seeding completed!');
  process.exit(0);
}

bootstrap().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
