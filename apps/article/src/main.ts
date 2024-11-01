import { NestFactory } from '@nestjs/core';
import { ArticleModule } from './article.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import {
  HttpExceptionFilter,
  ResponseInterceptor,
  RpcExceptionFilter,
} from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(ArticleModule);
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: { host: '0.0.0.0', port: configService.get('ARTICLE_TCP_PORT') },
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(), new RpcExceptionFilter());
  await app.startAllMicroservices();
  await app.listen(configService.get('ARTICLE_HTTP_PORT'));
}
bootstrap();
