import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import { Sequelize } from 'sequelize-typescript';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/public', express.static(join(__dirname, '..', 'public')));

  const sequelize = app.get(Sequelize);
  sequelize.sync();

  await app.listen(3000);
}

console.log('Starting server on http://localhost:3000');
bootstrap();
