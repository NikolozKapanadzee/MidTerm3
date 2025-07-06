import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    lowercase: true,
    // unique: true,
    type: String,
  })
  email: string;
  @Prop({
    required: true,
    type: String,
  })
  fullName: string;
  @Prop({
    required: true,
    type: String,
  })
  lastName: string;
  @Prop({
    required: true,
    type: Number,
  })
  age: number;
}
export const UserSchema = SchemaFactory.createForClass(User);
