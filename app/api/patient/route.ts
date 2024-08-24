import { NextRequest, NextResponse as res } from "next/server";

import { Patient, Record } from "@/models";
import connectDB from "@/lib/mongodb";

// Connect to the database
connectDB();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const gender = url.searchParams.get("gender") || "all"; // Default to 'all'
    const dateRange = url.searchParams.get("dateRange");
    const sort = url.searchParams.get("sort") || "newest"; // Default to 'newest'
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const search = url.searchParams.get("search") || ""; // Default to empty search string

    // Build query filter
    let filter: any = {};
    if (gender !== "all") {
      filter.gender = gender;
    }

    // Handle date range filtering
    if (dateRange) {
      const [fromDate, toDate] = dateRange
        .split(" - ")
        .map((dateStr) => new Date(dateStr.trim()));
      filter.createdAt = { $gte: fromDate, $lte: toDate };
    }

    // Handle search
    if (search) {
      const searchRegex = new RegExp(search, "i"); // Case-insensitive search
      filter.$or = [{ fullname: searchRegex }, { email: searchRegex }];
    }

    // Handle sorting
    const sortOrder = sort === "oldest" ? 1 : -1; // 1 for oldest to newest, -1 for newest to oldest

    // Pagination
    const skip = (page - 1) * limit;

    const patients = await Patient.find(filter)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit)
      .select("_id fullname phonenumber createdAt gender info.bloodgroup dob"); // Explicitly include _id and other required fields

    // Calculate age and format the response
    const patientsWithAge = patients.map((patient) => {
      const dob = new Date(patient.dob);
      const age =
        new Date().getFullYear() -
        dob.getFullYear() -
        (new Date().getMonth() < dob.getMonth() ||
        (new Date().getMonth() === dob.getMonth() &&
          new Date().getDate() < dob.getDate())
          ? 1
          : 0);
      return {
        _id: patient._id,
        fullname: patient.fullname,
        phone: patient.phonenumber,
        createdAt: patient.createdAt,
        gender: patient.gender,
        bloodgroup: patient.info.bloodgroup,
        age,
      };
    });

    // Count total patients for pagination
    const totalPatients = await Patient.countDocuments(filter);

    return res.json({
      patients: patientsWithAge,
      totalPatients,
      currentPage: page,
      totalPages: Math.ceil(totalPatients / limit),
    });
  } catch (error) {
    return res.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { fullname, phonenumber, email, gender, emergency, dob, address } =
      await request.json();
    const newPatient = new Patient({
      fullname,
      phonenumber,
      email,
      gender,
      emergency,
      dob,
      address,
    });
    const savedPatient = await newPatient.save();
    return res.json({ patient: savedPatient }, { status: 201 });
  } catch (error) {
    return res.json({ error: "Failed to create patient" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    const data = await request.json();
    const updatedPatient = await Patient.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedPatient) {
      return res.json({ error: "Patient not found" }, { status: 404 });
    }
    return res.json({ patient: updatedPatient });
  } catch (error: any) {
    console.log(error.message);
    return res.json(
      { error: error.message ? error.message : "Failed to update patient" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id"); // Get the ID from query parameters

    if (!id) {
      return res.json({ error: "Patient ID is required" }, { status: 400 });
    }

    // Check if the patient is present in any record
    const recordWithPatient = await Record.findOne({ patient: id });

    if (recordWithPatient) {
      return res.json(
        { error: "Patient with records cannot be deleted" },
        { status: 400 }
      );
    }

    // Proceed with the deletion
    const patient = await Patient.findByIdAndDelete(id);

    if (!patient) {
      return res.json({ error: "Patient not found" }, { status: 404 });
    }

    return res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    return res.json({ error: "Failed to delete patient" }, { status: 500 });
  }
}
