import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { ContentSeoService } from './content-seo.service';

@Controller('content-seo')
export class ContentSeoController {
  constructor(private contentSeoService: ContentSeoService) {}

  @Get('/analyze-keywords')
  analyzeKeywords(@Body('content') content: string) {
    return this.contentSeoService.analyzeKeywords(content);
  }

  @Post('/analyze-content')
  analyzeContent(
    @Body('content') content: string,
    @Query('lang') lang: string,
  ) {
    return this.contentSeoService.analyzeSEOContent(content, lang);
  }

  @Post('/generate')
  generateSeoContent(
    @Body('content') content: string,
    @Query('lang') lang: string,
  ) {
    return this.contentSeoService.generateSEOContent(content, lang);
  }
}
