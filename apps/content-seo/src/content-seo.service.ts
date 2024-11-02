import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ContentSeoService {
  private openai: OpenAI;
  private gemini: GoogleGenerativeAI;
  private geminiModel: GenerativeModel;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    this.gemini = new GoogleGenerativeAI(
      this.configService.get<string>('GEMINI_API_KEY'),
    );
    this.geminiModel = this.gemini.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });
  }

  async analyzeKeywords(content: string): Promise<string[]> {
    const prompt = `
      Analyze the following content and extract important keywords that would be relevant for SEO:
      Content: "${content}"
      Please just return the keywords as a list under js array.
    `;

    try {
      const result = await this.geminiModel.generateContent(prompt);

      const extracted = result.response.text().match(/\[([\s\S]*?)\]/)[0];
      const data: string[] = JSON.parse(extracted);
      return data;
    } catch (error) {
      console.error('Error analyzing keywords:', error);
      throw new InternalServerErrorException('Could not analyze keywords');
    }
  }

  async analyzeSEOContent(content: string, lang = 'vietnamese') {
    const prompt1 = `
      Analysis how to optimize SEO for the content and 
      explain it by ${lang} and no need for font formatting,\n\nContent:\n"${content}"`;
    try {
      const analysisResponse = await this.geminiModel.generateContent(prompt1);

      return analysisResponse.response.text();
    } catch (error) {
      console.error('Error generating content:', error);
      throw new InternalServerErrorException('Could not generate SEO content');
    }
  }

  async generateSEOContent(
    content: string,
    lang = 'vietnamese',
  ): Promise<string> {
    const prompt1 = `Completely rewrite an article the following content for SEO, rewrite it by ${lang} and no need for font formatting,\n\nContent:\n"${content}"`;
    try {
      const analysisResponse = await this.geminiModel.generateContent(prompt1);

      return analysisResponse.response.text();
    } catch (error) {
      console.error('Error generating content:', error);
      throw new InternalServerErrorException('Could not generate SEO content');
    }
  }
}
