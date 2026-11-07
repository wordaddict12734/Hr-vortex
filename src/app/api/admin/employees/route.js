import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const employees = await User.find({
      role: "employee",
      status: "active",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return Response.json({
      success: true,
      employees,
    });
  } catch (error) {
    console.error("Fetch employees error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch employees",
      },
      {
        status: 500,
      }
    );
  }
}