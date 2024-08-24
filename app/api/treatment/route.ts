import { NextRequest, NextResponse as res } from "next/server";
import connectDB from "@/lib/mongodb";
import { Record, Treatment } from "@/models";

// Connect to the database
connectDB();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || ""; // Default to empty search string
    const status = url.searchParams.get("status"); // Default to undefined for all statuses
    const currentPage = parseInt(
      url.searchParams.get("currentPage") || "1",
      10
    ); // Default to page 1
    const limit = parseInt(url.searchParams.get("limit") || "20", 10); // Default to 20 items per page

    // Build query filter
    let filter: any = {};

    if (status === "true" || status === "false") {
      filter.status = status === "true";
    }

    // Handle search
    if (search) {
      const searchRegex = new RegExp(search, "i"); // Case-insensitive search
      filter.$or = [{ name: searchRegex }, { description: searchRegex }];
    }

    // Count total number of filtered treatments
    const totalFilteredPatients = await Treatment.countDocuments(filter);

    // Fetch treatments with pagination
    const treatments = await Treatment.find(filter)
      .sort({ createdAt: "desc" }) // Sort order, you can adjust this as needed
      .skip((currentPage - 1) * limit)
      .limit(limit);

    // Calculate total pages
    const totalPages = Math.ceil(totalFilteredPatients / limit);

    return res.json({
      treatments,
      totalFilteredPatients,
      currentPage,
      totalPages,
    });
  } catch (error) {
    return res.json({ error: "Failed to fetch treatments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const treatment = new Treatment(data);
    await treatment.save();
    return res.json(treatment, { status: 201 });
  } catch (error) {
    return res.json({ error: "Failed to create treatment" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id"); // Get the ID from query parameters
    const data = await request.json();

    if (!id) {
      return res.json({ error: "Treatment ID is required" }, { status: 400 });
    }

    const treatment = await Treatment.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!treatment) {
      return res.json({ error: "Treatment not found" }, { status: 404 });
    }

    return res.json(treatment);
  } catch (error) {
    return res.json({ error: "Failed to update treatment" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id"); // Get the ID from query parameters

    if (!id) {
      return res.json(
        { error: "Treatment ID is required", success: false },
        { status: 400 }
      );
    }

    // Check if the treatment is present in any record
    const recordWithTreatment = await Record.findOne({ treatment: id });

    if (recordWithTreatment) {
      return res.json(
        {
          error: "Treatment cannot be deleted as it is used in a record",
          success: false,
        },
        { status: 400 }
      );
    }

    // Proceed with the deletion
    const treatment = await Treatment.findByIdAndDelete(id);

    if (!treatment) {
      return res.json({ error: "Treatment not found" }, { status: 404 });
    }

    return res.json({
      message: "Treatment deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.json({ error: "Failed to delete treatment" }, { status: 500 });
  }
}
