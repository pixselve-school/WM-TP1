import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as swStats from "swagger-stats";
import helmet from 'helmet';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as apiSpecif from "./swagger-specif/swagger-spec.json";
//import * as fs from "fs"; // use to generate swagger-spec.json

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(swStats.getMiddleware({swaggerSpec:apiSpecif}));
  const config = new DocumentBuilder()
    .setTitle('Gestion des Associations')
    .setDescription('Descriptions des APIs de la gestion des associations')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  //fs.writeFileSync("./swagger-spec.json", JSON.stringify(document)); // use to generate swagger-spec.json

  SwaggerModule.setup('api', app, document);

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors();

  await app.listen(3000);
}

bootstrap();
