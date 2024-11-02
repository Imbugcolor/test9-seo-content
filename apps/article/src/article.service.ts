import { Injectable } from '@nestjs/common';
import { ArticleRepository } from './article.repository';
import {
  Article,
  CreateArticleDto,
  GetArticleQueryDto,
  UpdateArticleDto,
} from '@app/common';
import { Model, Types } from 'mongoose';
import { Paginator } from '@app/common/paginator';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ArticleService {
  private paginator: Paginator<Article>;
  constructor(
    private articleRepository: ArticleRepository,
    @InjectModel(Article.name) private productModel: Model<Article>,
  ) {
    this.paginator = new Paginator<Article>(this.productModel);
  }

  public async create(createDto: CreateArticleDto) {
    const article = {
      _id: new Types.ObjectId(),
      title: createDto.title,
      originalContent: createDto.content,
      seoContent: createDto.seoContent,
      url: createDto.url,
    };
    const data = await this.articleRepository.create(article);
    return data;
  }

  public getList(query: GetArticleQueryDto) {
    const { limit, page, sort, ...searchQuery } = query;
    // Paginator & Filter & Sort
    return this.paginator.paginate(searchQuery, {
      limit,
      page,
      sort,
    });
  }

  public update(id: string, updateDto: UpdateArticleDto) {
    return this.articleRepository.findByIdAndUpdate(id, updateDto);
  }
}
