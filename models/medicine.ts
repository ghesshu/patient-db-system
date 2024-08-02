import mongoose,{ Schema, model } from "mongoose";
import { MedicineDoc } from "./types";

const MedicineDocSchema = new Schema<MedicineDoc>(
  {
    name: {
      type: String,
      required: true,
    },
    measure: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    des: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Medicine =
  mongoose.models.Medicine || model<MedicineDoc>("Medicine", MedicineDocSchema);
