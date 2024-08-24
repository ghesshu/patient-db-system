import { NextRequest, NextResponse as res } from "next/server";
import connectDB from "@/lib/mongodb";
import { Medicine, Patient, Treatment } from "@/models";

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

// Function to get the data
const getData = async () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
  const startOfMonth = new Date(currentYear, currentDate.getMonth(), 1);
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

  // Get the last month a patient was created
  const lastMonthWithPatients =
    monthlyResult.length > 0 ? monthlyResult[monthlyResult.length - 1]._id : 0;

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
      $lt: new Date(currentYear, currentDate.getMonth() + 1, 1),
    },
  });

  // Aggregate the number of patients created this year
  const yearCount = await Patient.countDocuments({
    createdAt: { $gte: startOfYear, $lt: new Date(currentYear + 1, 0, 1) },
  });

  // Get the 5 most recently created patients
  const recentPatients = await Patient.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("fullname email _id");

  // Initialize the monthlyPatientCounts up to the last month with patients
  const monthlyPatientCounts = Array.from(
    { length: lastMonthWithPatients },
    (_, index) => ({
      month: getMonthName(index + 1),
      patient: 0,
    })
  );

  // Update the monthlyPatientCounts array with actual counts from aggregation
  monthlyResult.forEach((entry: any) => {
    const monthIndex = entry._id - 1; // Convert to 0-based index
    if (monthlyPatientCounts[monthIndex]) {
      monthlyPatientCounts[monthIndex].patient = entry.count;
    }
  });

  // Get all patients created in the current month
  const currentMonthPatients = await Patient.find({
    createdAt: {
      $gte: startOfMonth,
      $lt: new Date(currentYear, currentDate.getMonth() + 1, 1),
    },
  }).select("fullname createdAt");

  const treatment = await Treatment.find({}).select("_id name");
  const medicine = await Medicine.find({}).select("_id name");

  return {
    todayCount,
    monthCount,
    yearCount,
    monthlyPatientCounts,
    recentPatients,
    currentMonthPatients,
    treatment,
    medicine,
  };
};

export async function GET(request: NextRequest) {
  if (request.headers.get("accept") === "text/event-stream") {
    // SSE implementation
    const encoder = new TextEncoder();
    let interval: NodeJS.Timeout;

    const readableStream = new ReadableStream({
      async start(controller) {
        const sendEvent = async () => {
          try {
            const data = await getData();
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
            );
          } catch (error) {
            controller.enqueue(
              encoder.encode(
                `event: error\ndata: ${JSON.stringify({ error: "Failed to fetch patient data" })}\n\n`
              )
            );
          }
        };

        // Initial data send
        await sendEvent();

        // Send data periodically
        interval = setInterval(sendEvent, 10000); // 10 seconds interval
      },
      cancel() {
        // Cleanup on stream cancel
        clearInterval(interval);
      },
    });

    return new res(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } else {
    // Regular GET request
    try {
      const data = await getData();
      return res.json(data);
    } catch (error) {
      return res.json(
        { error: "Failed to fetch patient data" },
        { status: 500 }
      );
    }
  }
}
