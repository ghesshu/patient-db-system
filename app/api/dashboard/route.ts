import { NextRequest, NextResponse as res } from "next/server";
import connectDB from "@/lib/mongodb";
import { Patient, Treatment } from "@/models";

// Connect to the database
connectDB();

// Helper function to get month names
const getMonthName = (monthIndex: number) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthIndex - 1]; // Month index is 1-based
};

export async function GET(request: NextRequest) {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const startOfYear = new Date(currentYear, 0, 1);

    // Aggregate the number of patients created each month of the current year
    const monthlyResult = await Patient.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYear,
            $lt: new Date(currentYear + 1, 0, 1),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" }, // Group by month
          count: { $sum: 1 }, // Count the number of patients
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month
      },
    ]);

    // Aggregate the number of patients created today
    const todayCount = await Patient.countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lt: new Date(startOfDay.getTime() + 86400000),
      },
    });

    // Aggregate the number of patients created this month
    const monthCount = await Patient.countDocuments({
      createdAt: {
        $gte: startOfMonth,
        $lt: new Date(currentYear, currentMonth + 1, 1),
      },
    });

    const treatment = await Treatment.find({}).select("_id name");

    // Aggregate the number of patients created this year
    const yearCount = await Patient.countDocuments({
      createdAt: { $gte: startOfYear, $lt: new Date(currentYear + 1, 0, 1) },
    });

    // Get the 5 most recently created patients
    const recentPatients = await Patient.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("fullname email _id");

    // Format the result to include months with full names
    const monthlyPatientCounts = monthlyResult.map((entry: any) => ({
      month: getMonthName(entry._id), // Convert month index to month name
      totalPatients: entry.count,
    }));

    return res.json({
      todayCount,
      monthCount,
      yearCount,
      monthlyPatientCounts,
      recentPatients,
      treatment,
    });
  } catch (error) {
    return res.json({ error: "Failed to fetch patient data" }, { status: 500 });
  }
}
