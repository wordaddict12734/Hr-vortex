import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();

    const { email, password, role } = await request.json();

    // Check required fields
    if (!email || !password || !role) {
      return Response.json(
        {
          success: false,
          message: "Email, password and role are required",
        },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Check account status
    if (user.status !== "active") {
      return Response.json(
        {
          success: false,
          message: "Your account is not active",
        },
        { status: 403 }
      );
    }

    // Check actual role stored in MongoDB
    if (user.role !== role) {
      return Response.json(
        {
          success: false,
          message: "Invalid role for this account",
        },
        { status: 403 }
      );
    }

    // Check password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return Response.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Login successful
    return Response.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        mustChangePassword: user.mustChangePassword,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong during login",
      },
      { status: 500 }
    );
  }
}