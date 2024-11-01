import { NestFactory } from '@nestjs/core';
import { CrawlerModule } from './crawler.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import {
  HttpExceptionFilter,
  ResponseInterceptor,
  RpcExceptionFilter,
} from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(CrawlerModule);
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: { host: '0.0.0.0', port: configService.get('TCP_PORT') },
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(), new RpcExceptionFilter());
  await app.startAllMicroservices();
  await app.listen(configService.get('CRAWLER_HTTP_PORT'));
}
bootstrap();
