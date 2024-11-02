import { Article } from '@app/common';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import OpenAI from 'openai';
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ContentSeoService {
  private openai: OpenAI;
  private gemini: GoogleGenerativeAI;
  private geminiModel: GenerativeModel;

  constructor(
    private configService: ConfigService,
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {
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

  async analyzeKeywords(id: string): Promise<string[]> {
    const article = await this.articleModel.findById(id).lean();
    if (!article) {
      throw new NotFoundException();
    }
    const prompt = `
      Analyze the following content and extract important keywords that would be relevant for SEO:
      Content: "${article.originalContent}"
      Please return the keywords as a list.
    `;

    try {
      const stream = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      });

      let response: string;

      for await (const chunk of stream) {
        response += chunk.choices[0]?.delta?.content || '';
      }

      return response
        .split('\n')
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword.length > 0);
    } catch (error) {
      console.error('Error analyzing keywords:', error);
      throw new Error('Could not analyze keywords');
    }
  }

  async analyzeKeywordsV2(id: string): Promise<string[]> {
    const article = await this.articleModel.findById(id).lean();
    if (!article) {
      throw new NotFoundException();
    }
    const prompt = `
      Analyze the following content and extract important keywords that would be relevant for SEO:
      Content: "${article.originalContent}"
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

  async generateSEOContent(id: string): Promise<string> {
    const article = await this.articleModel.findById(id).lean();
    if (!article) {
      throw new NotFoundException();
    }
    const keywords: string[] = [];
    const prompt = `Rewrite the following content for SEO with a focus on these keywords: 
        ${keywords.join(', ')}. Improve readability, keyword usage, 
        and structure for SEO.\n\nContent:\n"${article.originalContent}"`;

    try {
      const stream = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      });

      let response: string;
      for await (const chunk of stream) {
        response += chunk.choices[0]?.delta?.content || '';
      }

      return response;
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('Could not generate SEO content');
    }
  }

  async generateSEOContentV2(id: string): Promise<string> {
    const article = await this.articleModel.findById(id).lean();
    if (!article) {
      throw new NotFoundException();
    }
    const keywords = await this.analyzeKeywordsV2(id);
    const prompt = `Completely rewrite an article the following content for SEO with a focus on these keywords: 
        ${keywords.join(', ')}. Improve readability, keyword usage, 
        and structure for SEO.\n\nContent:\n"${article.originalContent}"`;

    try {
      const result = await this.geminiModel.generateContent(prompt);

      return result.response.text();
    } catch (error) {
      console.error('Error generating content:', error);
      throw new InternalServerErrorException('Could not generate SEO content');
    }
  }
}
