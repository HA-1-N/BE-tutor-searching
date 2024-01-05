import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SubjectDocument = HydratedDocument<Subject>;

@Schema({ timestamps: true })
export class Subject {
  @Prop()
  name: string;
  @Prop({ default: false })
  is_delete: boolean;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
