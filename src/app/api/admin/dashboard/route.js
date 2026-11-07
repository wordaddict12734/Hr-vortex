import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import EmployeeRequest from "@/models/EmployeeRequest";

export async function GET() {
  try {
    await connectDB();

    // Total active employees
    const totalEmployees = await User.countDocuments({
      role: "employee",
      status: "active",
    });

    // Pending registration requests
    const pendingRequests = await EmployeeRequest.countDocuments({
      status: "pending",
    });

    // Recently added active employees
    const recentEmployees = await User.find({
      role: "employee",
      status: "active",
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("fullName email phone role status createdAt")
      .lean();

    return Response.json({
      success: true,
      data: {
        totalEmployees,
        pendingRequests,
        recentEmployees: recentEmployees.map((employee) => ({
          id: employee._id.toString(),
          fullName: employee.fullName,
          email: employee.email,
          phone: employee.phone,
          status: employee.status,
          createdAt: employee.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("Dashboard API error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to load dashboard data",
      },
      { status: 500 }
    );
  }
}