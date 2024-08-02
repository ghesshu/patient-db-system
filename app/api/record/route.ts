import { NextRequest, NextResponse as res } from "next/server";
import connectDB from "@/lib/mongodb";
import { Record } from "@/models";
import { Patient } from "@/models";

// Connect to the database
connectDB();

export async function GET(request: NextRequest) {
  try {
    const records = await Record.find({})
      .populate("treatment")
      .populate("medicine.medicine");

    return res.json({ records });
  } catch (error) {
    return res.json({ error: "Failed to fetch records" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { patient, complains, diagnosos, vitalsigns, treatment, medicine } =
      await request.json();

    const newRecord = new Record({
      patient,
      complains,
      diagnosos,
      vitalsigns,
      treatment,
      medicine,
    });

    await newRecord.save();

    await Patient.findByIdAndUpdate(patient, {
      $push: { records: newRecord._id },
    });

    return res.json({ record: newRecord }, { status: 201 });
  } catch (error) {
    return res.json({ error: "Failed to create record" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const updates = await request.json();

    const updatedRecord = await Record.findByIdAndUpdate(id, updates, {
      new: true,
    })
      .populate("patient")
      .populate("treatment")
      .populate("medicine.medicine");

    if (!updatedRecord) {
      return res.json({ error: "Record not found" }, { status: 404 });
    }

    return res.json({ record: updatedRecord });
  } catch (error) {
    return res.json({ error: "Failed to update record" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    const deletedRecord = await Record.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res.json({ error: "Record not found" }, { status: 404 });
    }

    await Patient.findByIdAndUpdate(deletedRecord.patient, {
      $pull: { records: id },
    });

    return res.json({ message: "Record deleted successfully" });
  } catch (error) {
    return res.json({ error: "Failed to delete record" }, { status: 500 });
  }
}
