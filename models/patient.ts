import mongoose, { Schema, model } from "mongoose";
import { PatientDoc } from "./types";

const PatientDocSchema = new Schema<PatientDoc>(
  {
    fullname: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["female", "male"],
      required: true,
    },
    emergency: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    records: [
      {
        type: Schema.Types.ObjectId,
        ref: "Record",
      },
    ],
    info: {
      bloodgroup: {
        type: String,
      },
      weight: {
        type: Number,
      },
      height: {
        type: Number,
      },
      allergies: {
        type: String,
      },
      habits: {
        type: String,
      },
      mediclhistory: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

export const Patient =
  mongoose.models.Patient ||
  mongoose.model<PatientDoc>("Patient", PatientDocSchema);
