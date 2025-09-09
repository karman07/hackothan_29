import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  candidate_name: string;

  @Prop()
  relation: string;

  @Prop()
  parent_name: string;

  @Prop()
  institute: string;

  @Prop()
  course: string;

  @Prop()
  division: string;

  @Prop()
  marks_obtained: string;

  @Prop()
  marks_total: string;

  @Prop()
  date: string;

  @Prop()
  place: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
