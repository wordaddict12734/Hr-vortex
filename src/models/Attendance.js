import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    workDate: {
      type: String,
      required: true,
    },

    checkIn: {
      type: Date,
      required: true,
    },

    checkOut: {
      type: Date,
      default: null,
    },

    workedMinutes: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["checked-in", "completed"],
      default: "checked-in",
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index(
  { employeeId: 1, workDate: 1 },
  { unique: true }
);

const Attendance =
  mongoose.models.Attendance ||
  mongoose.model("Attendance", attendanceSchema);

export default Attendance;