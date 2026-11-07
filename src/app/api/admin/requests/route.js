import connectDB from "@/lib/mongodb";
import EmployeeRequest from "@/models/EmployeeRequest";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const page = Math.max(
      Number(searchParams.get("page")) || 1,
      1
    );

    const limit = Math.max(
      Number(searchParams.get("limit")) || 5,
      1
    );

    const skip = (page - 1) * limit;

    const totalRequests =
      await EmployeeRequest.countDocuments();

    const requests = await EmployeeRequest.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("fullName email phone status createdAt")
      .lean();

    const totalPages = Math.ceil(
      totalRequests / limit
    );

    return Response.json({
      success: true,
      data: {
        requests: requests.map((request) => ({
          id: request._id.toString(),
          fullName: request.fullName,
          email: request.email,
          phone: request.phone,
          status: request.status,
          createdAt: request.createdAt,
        })),
        currentPage: page,
        totalPages,
        totalRequests,
      },
    });
  } catch (error) {
    console.error("Requests API error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to load employee requests",
      },
      {
        status: 500,
      }
    );
  }
}