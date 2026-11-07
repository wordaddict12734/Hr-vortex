import mongoose from "mongoose";

const employeeDocumentSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    documentType: {
      type: String,
      enum: [
        "class10",
        "class12",
        "passportPhoto",
        "aadhaar",
        "degree",
      ],
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    storedName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const EmployeeDocument =
  mongoose.models.EmployeeDocument ||
  mongoose.model(
    "EmployeeDocument",
    employeeDocumentSchema
  );

export default EmployeeDocument;