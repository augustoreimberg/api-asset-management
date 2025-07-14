import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3333;
  const config = new DocumentBuilder()
    .setTitle('API NestJS')
    .setDescription('Documentação da API')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('/api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  app.enableCors({
    // origin: process.env.FRONT_END_URL,
    origin: '*',
    // credentials: true,
    credentials: false,
  });

  await app.listen(port, '0.0.0.0');
}

bootstrap();
