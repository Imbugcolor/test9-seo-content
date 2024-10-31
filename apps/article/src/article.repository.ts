import { AbstractRepository, Article } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ArticleRepository extends AbstractRepository<Article> {
  protected readonly logger = new Logger(ArticleRepository.name);

  constructor(@InjectModel(Article.name) articleModel: Model<Article>) {
    super(articleModel);
  }
}
