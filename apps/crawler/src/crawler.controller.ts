import { Controller } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { Post } from '@nestjs/common';

@Controller('/crawl')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post()
  crawlerArticles() {
    return this.crawlerService.fetchArticles();
  }
}
