import { NextRequest, NextResponse as res } from "next/server";
import connectDB from "@/lib/mongodb";
import { Campaign, Patient } from "@/models";
import sendEmail from "@/lib/mailer";

// Connect to the database
connectDB();

function calculateDaysAgo(date: Date): number {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export async function GET(request: NextRequest) {
  try {
    const campaigns = await Campaign.find({});
    const campaignsWithDaysAgo = campaigns.map((campaign) => {
      const daysAgo = calculateDaysAgo(campaign.createdAt);
      return {
        ...campaign.toObject(),
        daysAgo,
      };
    });

    return res.json({ campaigns: campaignsWithDaysAgo });
  } catch (error) {
    return res.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, subject, message } = await request.json();
    const patients = await Patient.find({}, { email: 1, _id: 0 }).lean(); // Exclude the _id field
    const emails = patients.map((patient) => patient.email);
    const emailOptions = {
      to: emails, // Replace with recipient's email
      subject: subject,
      template: "notif", // Template file name without .hbs extension
      context: {
        // header: header,
        message: message,
      },
    };

    const newCampaign = new Campaign({
      title,
      subject,
      message,
    });

    await sendEmail(emailOptions);

    await newCampaign.save();

    return res.json({ campaign: newCampaign }, { status: 201 });
  } catch (error) {
    return res.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}
