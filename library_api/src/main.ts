import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export interface ValidationPipeOptions extends ValidatorOptions {
  transform?: boolean;
  disableErrorMessages?: boolean;
  exceptionFactory?: (errors: ValidationError[]) => any;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enabled Auto Verified Input
  app.useGlobalPipes(new ValidationPipe());

  // Config Swagger (OpenAPI)
  const config = new DocumentBuilder()
    .setTitle("Library API")
    .setDescription("This API was created to fulfill the Backend Dev Techincal Test at PT EIGEN TRI MATHEMA.")
    .setVersion('0.0.1')
    .build()
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
