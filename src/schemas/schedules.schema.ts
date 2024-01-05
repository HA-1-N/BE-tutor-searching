import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ScheduleDocument = HydratedDocument<Schedule>;

@Schema({ timestamps: true })
export class Schedule {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  tutor_id: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  student_id: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' })
  subject_id: string;
  // 2: Monday 3: Tuesday 4: Wednesday 5:Thurday 6:Friday 7:Saturday 8:Sunday
  // 1: 7-8,5 2:7,5-9 3:...
  @Prop()
  time: string[];
  @Prop()
  day: string[];
  @Prop()
  hour: string[];
  @Prop()
  num_sessions: number;
  @Prop()
  address: string;
  @Prop({ default: false })
  is_accepted: boolean;
  // 1.Student   2.Tutor
  @Prop()
  type: number;
  @Prop()
  price: number;
  @Prop()
  place: string;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
