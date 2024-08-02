import { NextRequest, NextResponse as res } from "next/server";
import connectDB from "@/lib/mongodb";
import { Patient } from "@/models";

// Connect to the database
connectDB();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Fetch a specific patient by ID and populate the records
    const patient = await Patient.findById(id)
      .populate({
        path: "records",
        populate: [
          { path: "treatment", select: "name" },
          { path: "medicine.medicine", select: "name" },
        ],
      })
      .exec();

    if (!patient) {
      return res.json({ error: "Patient not found" }, { status: 404 });
    }

    // Calculate age
    const dob = new Date(patient.dob);
    const age =
      new Date().getFullYear() -
      dob.getFullYear() -
      (new Date().getMonth() < dob.getMonth() ||
      (new Date().getMonth() === dob.getMonth() &&
        new Date().getDate() < dob.getDate())
        ? 1
        : 0);

    return res.json({
      _id: patient._id,
      fullname: patient.fullname,
      phonenumber: patient.phonenumber,
      email: patient.email,
      gender: patient.gender,
      emergency: patient.emergency,
      dob: patient.dob,
      address: patient.address,
      info: patient.info,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
      age,
      records: patient.records, // Include populated records with treatment and medicine names
    });
  } catch (error) {
    return res.json({ error: "Failed to fetch patient" }, { status: 500 });
  }
}
