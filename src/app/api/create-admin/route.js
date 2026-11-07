import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({
      email: "your-email@gmail.com",
    });

    if (existingAdmin) {
      return Response.json({
        success: false,
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      "Stringson4765",
      10
    );

    const admin = await User.create({
      fullName: "Tanisha Sengupta",
      email: "mahisengupta715@gmail.com",
      phone: "9749614899",
      password: hashedPassword,
      role: "admin",
      status: "active",
    });

    return Response.json({
      success: true,
      message: "Admin created successfully",
      adminId: admin._id,
    });
  } catch (error) {
    console.error("Create admin error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to create admin",
      },
      { status: 500 }
    );
  }
}