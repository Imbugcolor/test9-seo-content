import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import {
  HttpExceptionFilter,
  ResponseInterceptor,
  RpcExceptionFilter,
} from '@app/common';
import { ContentSeoModule } from './content-seo.module';

async function bootstrap() {
  const app = await NestFactory.create(ContentSeoModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('SEOCONTENT_TCP_PORT'),
    },
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(), new RpcExceptionFilter());
  await app.startAllMicroservices();
  await app.listen(configService.get('SEOCONTENT_HTTP_PORT'));
}
bootstrap();
