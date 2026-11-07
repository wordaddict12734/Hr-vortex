import connectDB from "@/lib/mongodb";
import EmployeeRequest from "@/models/EmployeeRequest";
import User from "@/models/User";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    // Check MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid request ID",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const { status } = body;

    // Only allow approved or rejected
    if (!["approved", "rejected"].includes(status)) {
      return Response.json(
        {
          success: false,
          message: "Invalid status",
        },
        {
          status: 400,
        }
      );
    }

    // Find the employee request
    const employeeRequest =
      await EmployeeRequest.findById(id);

    if (!employeeRequest) {
      return Response.json(
        {
          success: false,
          message: "Employee request not found",
        },
        {
          status: 404,
        }
      );
    }

    
    // APPROVE EMPLOYEE
    

    if (status === "approved") {
      // Check if employee account already exists
      const existingUser = await User.findOne({
        email: employeeRequest.email,
      });

      if (!existingUser) {
        // Temporary password for now
        const temporaryPassword = "HRVortex@123";

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(
          temporaryPassword,
          10
        );

        // Create employee account
        await User.create({
          fullName: employeeRequest.fullName,
          email: employeeRequest.email,
          phone: employeeRequest.phone,
          password: hashedPassword,
          role: "employee",
          status: "active",
          mustChangePassword: true,
        });
      }
    }

    
    // UPDATE REQUEST STATUS
    

    employeeRequest.status = status;

    await employeeRequest.save();

    return Response.json({
      success: true,
      message: `Request ${status} successfully`,
      data: {
        id: employeeRequest._id.toString(),
        fullName: employeeRequest.fullName,
        email: employeeRequest.email,
        phone: employeeRequest.phone,
        status: employeeRequest.status,
        createdAt: employeeRequest.createdAt,
      },
    });
  } catch (error) {
    console.error("Update request error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update employee request",
      },
      {
        status: 500,
      }
    );
  }
}