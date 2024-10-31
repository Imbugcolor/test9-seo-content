import { IsOptional } from 'class-validator';

export class CreateArticleDto {
  title: string;
  content: string;
  url: string;
}

export class GetArticleQueryDto {
  @IsOptional()
  limit: number;

  @IsOptional()
  page: number;

  @IsOptional()
  sort: string;

  @IsOptional()
  search: string;
}
