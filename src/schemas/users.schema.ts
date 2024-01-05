import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  // 1: student  2: tutor 3:admin
  @Prop({ default: 1 })
  role: number;

  @Prop({ default: 0 })
  money: number;

  @Prop()
  phone: string;

  // 1: male  2: femal
  @Prop()
  gender: number;

  @Prop()
  date_of_birth: string;

  @Prop({ default: false })
  is_block: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
