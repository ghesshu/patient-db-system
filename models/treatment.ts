import mongoose, { Schema, model } from "mongoose";
import { TreatmentDoc } from "./types";

const TreatmentDocSchema = new Schema<TreatmentDoc>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
}, {timestamps: true});

export const Treatment =
  mongoose.models.Treatment ||
  model<TreatmentDoc>("Treatment", TreatmentDocSchema);
