import { NextRequest, NextResponse as res } from "next/server";
import connectDB from "@/lib/mongodb";
import { Medicine, Record } from "@/models";

// Connect to the database
connectDB();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || ""; // Default to empty search string
    const stockStatus = url.searchParams.get("stockStatus"); // "in_stock" or "out_of_stock"
    const currentPage = parseInt(
      url.searchParams.get("currentPage") || "1",
      10
    ); // Default to page 1
    const limit = parseInt(url.searchParams.get("limit") || "20", 10); // Default to 20 items per page

    // Build query filter
    let filter: any = {};

    if (stockStatus === "in_stock") {
      filter.stock = { $gt: 0 }; // Stock greater than 0
    } else if (stockStatus === "out_of_stock") {
      filter.stock = 0; // Stock exactly 0
    }

    // Handle search
    if (search) {
      const searchRegex = new RegExp(search, "i"); // Case-insensitive search
      filter.$or = [
        { name: searchRegex },
        { measure: searchRegex },
        { des: searchRegex },
      ];
    }

    // Count total number of filtered medicines
    const totalFilteredMedicines = await Medicine.countDocuments(filter);

    // Fetch medicines with pagination
    const medicines = await Medicine.find(filter)
      .sort({ createdAt: "desc" }) // Sort order, you can adjust this as needed
      .skip((currentPage - 1) * limit)
      .limit(limit);

    // Calculate total pages
    const totalPages = Math.ceil(totalFilteredMedicines / limit);

    return res.json({
      medicines,
      totalFilteredMedicines,
      currentPage,
      totalPages,
    });
  } catch (error) {
    return res.json({ error: "Failed to fetch medicines" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const medicine = new Medicine(data);
    await medicine.save();
    return res.json(medicine, { status: 201 });
  } catch (error) {
    return res.json({ error: "Failed to create medicine" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id"); // Get the ID from query parameters
    const data = await request.json();

    if (!id) {
      return res.json({ error: "Medicine ID is required" }, { status: 400 });
    }

    const medicine = await Medicine.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!medicine) {
      return res.json({ error: "Medicine not found" }, { status: 404 });
    }

    return res.json(medicine);
  } catch (error) {
    return res.json({ error: "Failed to update medicine" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id"); // Get the ID from query parameters

    if (!id) {
      return res.json({ error: "Medicine ID is required" }, { status: 400 });
    }

    // Check if the medicine is present in any record
    const recordWithMedicine = await Record.findOne({
      "medicine.medicine": id,
    });

    if (recordWithMedicine) {
      return res.json(
        { error: "Medicine cannot be deleted as it is used in a record" },
        { status: 400 }
      );
    }

    // Proceed with the deletion
    const medicine = await Medicine.findByIdAndDelete(id);

    if (!medicine) {
      return res.json({ error: "Medicine not found" }, { status: 404 });
    }

    return res.json({ message: "Medicine deleted successfully" });
  } catch (error) {
    return res.json({ error: "Failed to delete medicine" }, { status: 500 });
  }
}
