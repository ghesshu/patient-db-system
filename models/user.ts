import mongoose, { Schema, model, Document } from "mongoose";

interface UserDoc extends Document {
  email: string;
  password: string;
  name: string;
}

const UserSchema = new Schema<UserDoc>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});

export const User = mongoose.models.User || model<UserDoc>("User", UserSchema);
