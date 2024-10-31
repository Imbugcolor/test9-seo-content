import { Module } from '@nestjs/common';
import { ContentSeoController } from './content-seo.controller';
import { ContentSeoService } from './content-seo.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { Article, ArticleSchema, DatabaseModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        OPENAI_API_KEY: Joi.string().required(),
        SEOCONTENT_HTTP_PORT: Joi.number().required(),
        SEOCONTENT_TCP_PORT: Joi.number().required(),
      }),
    }),
    DatabaseModule,
    DatabaseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
  ],
  controllers: [ContentSeoController],
  providers: [ContentSeoService],
})
export class ContentSeoModule {}
