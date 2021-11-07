import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AppModule } from './app.module';

declare module 'express' {
  interface Request {
    user: Omit<User, 'password'>;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Devxs E-Commerce')
    .setDescription('The Devxs Api Description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.enableCors({ origin: 'http://localhost:3000' });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();
