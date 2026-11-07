import connectDB from "@/lib/mongodb";
import EmployeeProfile from "@/models/EmployeeProfile";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      employeeId,

      // Personal Information
      dateOfBirth,
      gender,
      maritalStatus,
      alternatePhone,
      personalEmail,
      address,
      city,
      state,
      pincode,

      // Education
      education,

      // Work Experience
      isFresher,
      experiences,
    } = body;

    
    // CHECK EMPLOYEE ID
    

    if (!employeeId) {
      return Response.json(
        {
          success: false,
          message: "Employee ID is required",
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid employee ID",
        },
        { status: 400 }
      );
    }

    
    // FIND EXISTING PROFILE
    
    let profile = await EmployeeProfile.findOne({
      employeeId,
    });
    
    // CREATE UPDATE OBJECT
    
    const updateData = {};
   
    // PERSONAL INFORMATION
   

    if (
      dateOfBirth !== undefined ||
      gender !== undefined ||
      address !== undefined ||
      city !== undefined ||
      state !== undefined ||
      pincode !== undefined
    ) {
      // Required personal fields
      if (
        !dateOfBirth ||
        !gender ||
        !address ||
        !city ||
        !state ||
        !pincode
      ) {
        return Response.json(
          {
            success: false,
            message: "Please fill in all required personal fields",
          },
          { status: 400 }
        );
      }

      if (!/^\d{6}$/.test(pincode)) {
        return Response.json(
          {
            success: false,
            message: "Pincode must be exactly 6 digits",
          },
          { status: 400 }
        );
    }

      updateData.dateOfBirth = dateOfBirth;
      updateData.gender = gender;
      updateData.maritalStatus = maritalStatus;
      updateData.alternatePhone = alternatePhone;
      updateData.personalEmail = personalEmail;
      updateData.address = address;
      updateData.city = city;
      updateData.state = state;
      updateData.pincode = pincode;
    }

   
    // EDUCATION
   

    if (education !== undefined) {
      updateData.education = education;
    }

   
    // WORK EXPERIENCE
   

    if (isFresher !== undefined) {
      updateData.isFresher = isFresher;

      updateData.experiences = isFresher
        ? []
        : experiences || [];
    }

    
    // CREATE OR UPDATE PROFILE
    

    if (profile) {
      profile = await EmployeeProfile.findOneAndUpdate(
        { employeeId },
        { $set: updateData },
        {
          new: true,
          runValidators: true,
        }
      );
    } else {
      profile = await EmployeeProfile.create({
        employeeId,
        ...updateData,
      });
    }

    
    // RESPONSE
    

    return Response.json(
      {
        success: true,

        message: "Profile saved successfully",

        data: {
          id: profile._id.toString(),

          employeeId: profile.employeeId.toString(),

          // Personal
          dateOfBirth: profile.dateOfBirth,
          gender: profile.gender,
          maritalStatus: profile.maritalStatus,
          alternatePhone: profile.alternatePhone,
          personalEmail: profile.personalEmail,
          address: profile.address,
          city: profile.city,
          state: profile.state,
          pincode: profile.pincode,

          // Education
          education: profile.education,

          // Work Experience
          isFresher: profile.isFresher,
          experiences: profile.experiences,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Employee profile POST error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to save employee profile",
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const employeeId = searchParams.get("employeeId");

    if (!employeeId) {
      return Response.json(
        {
          success: false,
          message: "Employee ID is required",
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid employee ID",
        },
        { status: 400 }
      );
    }

    const profile = await EmployeeProfile.findOne({
      employeeId,
    }).lean();

    if (!profile) {
      return Response.json(
        {
          success: false,
          message: "Employee profile not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,

      data: {
        id: profile._id.toString(),

        employeeId: profile.employeeId.toString(),

        // =========================
        // PERSONAL INFORMATION
        // =========================

        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        maritalStatus: profile.maritalStatus,
        alternatePhone: profile.alternatePhone,
        personalEmail: profile.personalEmail,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode,

        // =========================
        // EDUCATION
        // =========================

        education: profile.education || {
          class10: {},
          class12: {},
          graduation: {},
        },

        // =========================
        // WORK EXPERIENCE
        // =========================

        isFresher: profile.isFresher ?? true,
        experiences: profile.experiences || [],
      },
    });
  } catch (error) {
    console.error("Employee profile GET error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to load employee profile",
      },
      { status: 500 }
    );
  }
}