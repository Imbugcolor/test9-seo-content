import { IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateArticleDto {
  @IsString()
  title: string;
  @IsString()
  content: string;
  @IsString()
  url: string;
  @IsOptional()
  @IsString()
  seoContent?: string;
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

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
