import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database';

@Schema({ timestamps: true, versionKey: false })
export class Article extends AbstractDocument {
  @Prop({ type: String, default: '' })
  title: string;

  @Prop({ type: String, default: '' })
  originalContent: string;

  @Prop({ type: String, default: '' })
  seoContent?: string;

  @Prop({ type: String, default: '' })
  url: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

ArticleSchema.index({ title: 'text' });
