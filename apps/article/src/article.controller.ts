import { Body, Controller, Get, Post, Patch, Param, Query } from '@nestjs/common';
import { ArticleService } from './article.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  CreateArticleDto,
  GetArticleQueryDto,
  UpdateArticleDto,
} from '@app/common';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/list')
  async getList(@Query() query: GetArticleQueryDto) {
    return this.articleService.getList(query);
  }

  @Post('/create')
  async createArticle(@Body() createDto: CreateArticleDto) {
    return this.articleService.create(createDto);
  }

  @Patch('/update/:id')
  async updateArticle(
    @Param('id') id: string,
    @Body() updateDto: UpdateArticleDto,
  ) {
    return this.articleService.update(id, updateDto);
  }

  @EventPattern('create-article')
  async create(@Payload() data: CreateArticleDto) {
    return this.articleService.create(data);
  }
}
