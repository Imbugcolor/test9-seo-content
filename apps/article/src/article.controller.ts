import { Controller, Get, Query } from '@nestjs/common';
import { ArticleService } from './article.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateArticleDto, GetArticleQueryDto } from '@app/common';

@Controller()
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/list')
  async getList(@Query() query: GetArticleQueryDto) {
    return this.articleService.getList(query);
  }

  @EventPattern('create-article')
  async create(@Payload() data: CreateArticleDto) {
    return this.articleService.create(data);
  }
}
