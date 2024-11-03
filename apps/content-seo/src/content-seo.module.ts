import { Module } from '@nestjs/common';
import { ContentSeoController } from './content-seo.controller';
import { ContentSeoService } from './content-seo.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        GEMINI_API_KEY: Joi.string().required(),
        SEOCONTENT_HTTP_PORT: Joi.number().required(),
        SEOCONTENT_TCP_PORT: Joi.number().required(),
      }),
    }),
  ],
  controllers: [ContentSeoController],
  providers: [ContentSeoService],
})
export class ContentSeoModule {}
