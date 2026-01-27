import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    bodyParser: true,
  });

  // Increase payload size limit for quiz images
  app.use(require('express').json({ limit: '50mb' }));
  app.use(require('express').urlencoded({ limit: '50mb', extended: true }));

  // Security
  app.use(helmet());
  app.use(compression());

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger documentation
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Gatherly API')
      .setDescription('Centralized Club Management System API')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management')
      .addTag('clubs', 'Club management')
      .addTag('activities', 'Activity management')
      .addTag('quizzes', 'Quiz system')
      .addTag('leaderboards', 'Leaderboards')
      .addTag('resources', 'Resource sharing')
      .addTag('comments', 'Anonymous comments')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT || 5000;
  await app.listen(port);

  console.log(`
    ╔═══════════════════════════════════════╗
    ║                                       ║
    ║     🚀 Gatherly API Server 🚀        ║
    ║                                       ║
    ║     Environment: ${process.env.NODE_ENV || 'development'}            ║
    ║     Port: ${port}                          ║
    ║     Docs: http://localhost:${port}/api/docs  ║
    ║                                       ║
    ╚═══════════════════════════════════════╝
  `);
}

bootstrap();


