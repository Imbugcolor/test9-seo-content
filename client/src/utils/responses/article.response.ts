import { Article } from '../interfaces/article.interface';
import { DataResponse } from '../interfaces/response.interface';

export interface ArticleDataResponse extends DataResponse {
  data: {
    data: Article[];
    page: string;
    total: number;
  };
}

export interface SavedArticleResponse extends DataResponse {
    data: Article
}
