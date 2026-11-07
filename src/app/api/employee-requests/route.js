import connectDB from "@/lib/mongodb";
import EmployeeRequest from "@/models/EmployeeRequest";

export async function POST(request) {
  try {
    const body = await request.json();

    const { fullName, email, phone } = body;

    // Check if all required fields are present
    if (!fullName || !email || !phone) {
      return Response.json(
        {
          success: false,
          message: "Full name, email and phone are required",
        },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Check if this email already has a request
    const existingRequest = await EmployeeRequest.findOne({ email });

    if (existingRequest) {
      return Response.json(
        {
          success: false,
          message: "A registration request already exists for this email",
        },
        { status: 409 }
      );
    }

    // Create the registration request
    const employeeRequest = await EmployeeRequest.create({
      fullName,
      email,
      phone,
    });

    return Response.json(
      {
        success: true,
        message: "Registration request submitted successfully",
        data: employeeRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Employee registration error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get all employee requests
    const employeeRequests = await EmployeeRequest.find();

    // Return the data
    return Response.json(
      {
        success: true,
        message: "Employee registration requests retrieved successfully.",
        data: employeeRequests,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving employee registration requests:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to retrieve employee registration requests.",
      },
      { status: 500 }
    );
  }
}