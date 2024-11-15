import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({
    origin: ['*'], // Add your frontend domain
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(4000);
}
bootstrap();
