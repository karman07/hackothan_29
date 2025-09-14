import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Call extends Document {
  @Prop()
  candidate_name: string;

  @Prop()
  institute: string;

  @Prop()
  course: string;

  @Prop()
  signature_similarity_score: number;

  @Prop()
  signature_match: boolean;

  @Prop()
  is_legitimate: boolean;

  @Prop({ type: Object })
  key_details: Record<string, any>;

  @Prop()
  authenticity_check: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const CallSchema = SchemaFactory.createForClass(Call);
