import { ARTICLE_SERVICE } from '@app/common';
import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class CrawlerService {
  private baseUrl = 'https://vnexpress.net/';
  constructor(
    @Inject(ARTICLE_SERVICE)
    private articleService: ClientProxy,
  ) {}

  async fetchArticles() {
    try {
      const { data } = await axios.get(this.baseUrl);
      const $ = cheerio.load(data);

      // Lấy danh sách các bài viết
      const articles: { title: string; url: string }[] = [];
      $('.title-news a').each((index, element) => {
        const title = $(element).text();
        const url = $(element).attr('href');
        articles.push({ title, url });
      });

      if (articles.length > 0) {
        await Promise.all(
          articles.map(async (article) => {
            const detail = await this.fetchArticleContent(article.url);
            this.articleService.emit('create-article', {
              title: article.title,
              url: article.url,
              content: detail.content,
            });
          }),
        );
      }
      return 'OK';
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  }

  // Crawl nội dung chi tiết của bài viết
  async fetchArticleContent(url: string) {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      // Lấy tiêu đề và nội dung bài viết
      const title = $('.title-detail').text();
      const content = [];
      $('.Normal').each((index, element) => {
        content.push($(element).text());
      });

      return {
        title,
        content: content.join('\n'), // Ghép các đoạn văn lại thành một nội dung duy nhất
        url,
      };
    } catch (error) {
      console.error('Error fetching article content:', error);
      return null;
    }
  }
}
