import { Module } from '@nestjs/common';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ARTICLE_SERVICE } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        CRAWLER_HTTP_PORT: Joi.number().required(),
        CRAWLER_TCP_PORT: Joi.number().required(),
        ARTICLE_HOST: Joi.string().required(),
        ARTICLE_PORT: Joi.number().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: ARTICLE_SERVICE,
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('ARTICLE_HOST'),
            port: configService.get('ARTICLE_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [CrawlerController],
  providers: [CrawlerService],
})
export class CrawlerModule {}
