import { Controller, Get, Param, Post } from '@nestjs/common';
import { ContentSeoService } from './content-seo.service';

@Controller('content-seo')
export class ContentSeoController {
  constructor(private contentSeoService: ContentSeoService) {}

  @Get('/analyze-keywords/:id')
  analyzeKeywords(@Param('id') id: string) {
    return this.contentSeoService.analyzeKeywordsV2(id);
  }

  @Post('/generate/:id')
  generateSeoContent(@Param('id') id: string) {
    return this.contentSeoService.generateSEOContentV2(id);
  }
}
