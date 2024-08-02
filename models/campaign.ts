import mongoose, { Schema, model } from "mongoose";
import { CampaignDoc } from "./types";

const CampaignDocSchema = new Schema<CampaignDoc>(
  {
    title: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Campaign =
  mongoose.models.Campaign || model<CampaignDoc>("Campaign", CampaignDocSchema);
