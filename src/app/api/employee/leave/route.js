import connectDB from "@/lib/mongodb";
import LeaveRequest from "@/models/LeaveRequest";
import mongoose from "mongoose";

/* =====================================
   GET
   Get employee's leave requests
===================================== */

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

    const leaveRequests = await LeaveRequest.find({
      employeeId,
    })
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({
      success: true,

      data: leaveRequests.map((leave) => ({
        id: leave._id.toString(),
        employeeId: leave.employeeId.toString(),

        leaveType: leave.leaveType,

        fromDate: leave.fromDate,
        toDate: leave.toDate,

        reason: leave.reason,

        status: leave.status,

        adminComment: leave.adminComment || "",

        createdAt: leave.createdAt,
        updatedAt: leave.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Leave GET error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to load leave requests",
      },
      { status: 500 }
    );
  }
}

/* =====================================
   POST
   Create new leave request
===================================== */

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      employeeId,
      leaveType,
      fromDate,
      toDate,
      reason,
    } = body;

    /* =====================================
       REQUIRED FIELDS
    ===================================== */

    if (
      !employeeId ||
      !leaveType ||
      !fromDate ||
      !toDate ||
      !reason
    ) {
      return Response.json(
        {
          success: false,
          message: "Please fill in all required fields",
        },
        { status: 400 }
      );
    }

    /* =====================================
       VALIDATE EMPLOYEE ID
    ===================================== */

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid employee ID",
        },
        { status: 400 }
      );
    }

    /* =====================================
       VALIDATE DATE FORMAT
    ===================================== */

    const from = new Date(`${fromDate}T00:00:00`);
    const to = new Date(`${toDate}T00:00:00`);

    if (
      Number.isNaN(from.getTime()) ||
      Number.isNaN(to.getTime())
    ) {
      return Response.json(
        {
          success: false,
          message: "Invalid leave dates",
        },
        { status: 400 }
      );
    }

    /* =====================================
       DATE ORDER
    ===================================== */

    if (to < from) {
      return Response.json(
        {
          success: false,
          message:
            "To date cannot be earlier than from date",
        },
        { status: 400 }
      );
    }

    /* =====================================
       VALIDATE LEAVE TYPE
    ===================================== */

    const validLeaveTypes = [
      "Casual Leave",
      "Sick Leave",
      "Earned Leave",
      "Other",
    ];

    if (!validLeaveTypes.includes(leaveType)) {
      return Response.json(
        {
          success: false,
          message: "Invalid leave type",
        },
        { status: 400 }
      );
    }

    /* =====================================
       REASON LENGTH
    ===================================== */

    if (reason.trim().length < 5) {
      return Response.json(
        {
          success: false,
          message:
            "Please provide a proper reason for your leave",
        },
        { status: 400 }
      );
    }

    /* =====================================
       CHECK OVERLAPPING LEAVE
    ===================================== */

    const overlappingLeave =
      await LeaveRequest.findOne({
        employeeId,

        status: {
          $in: ["pending", "approved"],
        },

        fromDate: {
          $lte: toDate,
        },

        toDate: {
          $gte: fromDate,
        },
      });

    if (overlappingLeave) {
      return Response.json(
        {
          success: false,
          message:
            "You already have a pending or approved leave request for these dates",
        },
        { status: 409 }
      );
    }

    /* =====================================
       CREATE LEAVE REQUEST
    ===================================== */

    const leaveRequest =
      await LeaveRequest.create({
        employeeId,
        leaveType,
        fromDate,
        toDate,
        reason: reason.trim(),
        status: "pending",
      });

    /* =====================================
       CALCULATE DAYS
    ===================================== */

    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    const duration =
      Math.floor(
        (to.getTime() - from.getTime()) /
          millisecondsPerDay
      ) + 1;

    /* =====================================
       RESPONSE
    ===================================== */

    return Response.json(
      {
        success: true,

        message:
          "Leave request submitted successfully",

        data: {
          id: leaveRequest._id.toString(),

          employeeId:
            leaveRequest.employeeId.toString(),

          leaveType:
            leaveRequest.leaveType,

          fromDate:
            leaveRequest.fromDate,

          toDate:
            leaveRequest.toDate,

          duration,

          reason:
            leaveRequest.reason,

          status:
            leaveRequest.status,

          adminComment:
            leaveRequest.adminComment || "",

          createdAt:
            leaveRequest.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Leave POST error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to submit leave request",
      },
      { status: 500 }
    );
  }
}