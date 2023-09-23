import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';
config();
import { AppModule } from './modules/main/app.module';

async function bootstrap() {
  const logger = new Logger('testing');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  //Swagger
  const config = new DocumentBuilder()
    .setTitle('the-creative-space-api')
    .setDescription('the-creative-space API Description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  logger.log(typeof process.env.IS_SSL);
  await app.listen(parseInt(process.env.APP_PORT) || 1410);
  logger.log(`App is running on ${parseInt(process.env.APP_PORT)} port!`);
}
bootstrap();
