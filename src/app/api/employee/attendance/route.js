import connectDB from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import mongoose from "mongoose";

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

    const attendance = await Attendance.find({
      employeeId,
    })
      .sort({ workDate: -1 })
      .lean();

    return Response.json({
      success: true,
      data: attendance.map((record) => ({
        id: record._id.toString(),
        workDate: record.workDate,
        checkIn: record.checkIn,
        checkOut: record.checkOut,
        workedMinutes: record.workedMinutes,
        status: record.status,
      })),
    });
  } catch (error) {
    console.error("Attendance GET error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to load attendance",
      },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      employeeId,
      action,
      workDate,
      currentTime,
    } = body;

    if (
      !employeeId ||
      !action ||
      !workDate ||
      !currentTime
    ) {
      return Response.json(
        {
          success: false,
          message: "Required attendance information is missing",
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

    /*CHECK IN*/

    if (action === "check-in") {
      const existingAttendance =
        await Attendance.findOne({
          employeeId,
          workDate,
        });

      if (existingAttendance) {
        return Response.json(
          {
            success: false,
            message: "You have already checked in today",
          },
          { status: 409 }
        );
      }

      const attendance = await Attendance.create({
        employeeId,
        workDate,
        checkIn: new Date(currentTime),
        status: "checked-in",
      });

      return Response.json(
        {
          success: true,
          message: "Checked in successfully",
          data: attendance,
        },
        { status: 201 }
      );
    }


    /*CHECK OUT*/

    if (action === "check-out") {
      const attendance =
        await Attendance.findOne({
          employeeId,
          workDate,
        });

      if (!attendance) {
        return Response.json(
          {
            success: false,
            message: "Please check in first",
          },
          { status: 400 }
        );
      }

      if (attendance.checkOut) {
        return Response.json(
          {
            success: false,
            message: "You have already checked out today",
          },
          { status: 409 }
        );
      }

      const checkOutTime = new Date(currentTime);

      const workedMilliseconds = checkOutTime.getTime() - attendance.checkIn.getTime();

      const workedMinutes = Math.max(0, Math.floor(workedMilliseconds / 60000));

      attendance.checkOut = checkOutTime;
      attendance.workedMinutes = workedMinutes;
      attendance.status = "completed";

      await attendance.save();

      return Response.json({
        success: true,
        message: "Checked out successfully",
        data: attendance,
      });
    }


    return Response.json(
      {
        success: false,
        message: "Invalid attendance action",
      },
      { status: 400 }
    );

  } catch (error) {
    console.error("Attendance POST error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update attendance",
      },
      { status: 500 }
    );
  }
}