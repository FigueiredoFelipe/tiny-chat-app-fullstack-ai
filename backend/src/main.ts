import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS for the frontend
  app.useGlobalPipes(new ValidationPipe()); // Enables auto validation with DTOs
  await app.listen(3000);
}
bootstrap();
