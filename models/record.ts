import mongoose, { Schema, model } from "mongoose";
import { RecordDoc } from "./types";

const RecordDocSchema = new Schema<RecordDoc>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    complains: {
      type: String,
      required: true,
    },
    diagnosos: {
      type: String,
      required: true,
    },
    vitalsigns: {
      type: String,
      required: true,
    },
    treatment: [
      {
        type: Schema.Types.ObjectId,
        ref: "Treatment",
        required: true,
      },
    ],
    medicine: [
      {
        medicine: {
          type: Schema.Types.ObjectId,
          ref: "Medicine",
          required: true,
        },
        instruction: {
          type: String,
          required: true,
        },
        quantity: {
          type: String,
          required: true,
        },
        // dosage: {
        //   type: [String],
        //   enum: ["Morning", "Afternoon", "Evening"],
        //   required: true,
        // },
      },
    ],
  },
  { timestamps: true }
);

export const Record =
  mongoose.models.Record || model<RecordDoc>("Record", RecordDocSchema);
