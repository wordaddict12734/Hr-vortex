import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();

    const { email, newPassword } = await request.json();

    // Check required fields
    if (!email || !newPassword) {
      return Response.json(
        {
          success: false,
          message: "Email and new password are required",
        },
        { status: 400 }
      );
    }

    // Check password length
    if (newPassword.length < 8) {
      return Response.json(
        {
          success: false,
          message: "Password must be at least 8 characters long",
        },
        { status: 400 }
      );
    }

    // Find employee
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      role: "employee",
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Employee account not found",
        },
        { status: 404 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    user.mustChangePassword = false;

    await user.save();

    return Response.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update password",
      },
      { status: 500 }
    );
  }
}