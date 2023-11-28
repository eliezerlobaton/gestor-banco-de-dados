import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';

import { AppModule } from './app.module';

import type { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  // app.setGlobalPrefix('api')
  // app.enableCors({
  //   origin: 'http://localhost:3000',
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  //   allowedHeaders: ['Conten-Type', 'Authorization'],
  //   credentials: true
  // });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('EmpreenderDinheiro API')
    .setDescription('API para gestão de banco de dados da EmpreenderDinheiro')
    .setVersion('1.0')
    .addTag('Alunos')
    .addTag('Assinaturas')
    .addTag('Transações')
    .addTag('Usuários')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
