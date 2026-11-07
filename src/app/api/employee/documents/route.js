import connectDB from "@/lib/mongodb";
import EmployeeDocument from "@/models/EmployeeDocument";
import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";

const allowedDocuments = [
  "class10",
  "class12",
  "passportPhoto",
  "aadhaar",
  "degree",
];

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "application/pdf",
];

export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();

    const employeeId = formData.get("employeeId");
    const documentType = formData.get("documentType");
    const file = formData.get("file");

    if (!employeeId || !documentType || !file) {
      return Response.json(
        {
          success: false,
          message:
            "Employee ID, document type and file are required",
        },
        { status: 400 }
      );
    }

    if (!allowedDocuments.includes(documentType)) {
      return Response.json(
        {
          success: false,
          message: "Invalid document type",
        },
        { status: 400 }
      );
    }

    if (!allowedMimeTypes.includes(file.type)) {
      return Response.json(
        {
          success: false,
          message:
            "Only JPG, PNG and PDF files are allowed",
        },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return Response.json(
        {
          success: false,
          message: "File size must not exceed 5 MB",
        },
        { status: 400 }
      );
    }

    /*
      Create employee-specific folder
    */

    const uploadDirectory = path.join(
      process.cwd(),
      "uploads",
      "documents",
      employeeId
    );

    await fs.mkdir(uploadDirectory, {
      recursive: true,
    });

    /*
      Create a unique filename
    */

    const extension = path.extname(file.name);

    const storedName = `${documentType}_${Date.now()}${extension}`;

    const filePath = path.join(
      uploadDirectory,
      storedName
    );

    /*
      Convert uploaded file to Buffer
    */

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    /*
      Save actual file to computer
    */

    await fs.writeFile(filePath, buffer);

    /*
      Save only file information in MongoDB
    */

    const document = await EmployeeDocument.create({
      employeeId,
      documentType,
      originalName: file.name,
      storedName,
      filePath: `uploads/documents/${employeeId}/${storedName}`,
      fileSize: file.size,
      mimeType: file.type,
    });

    return Response.json(
      {
        success: true,
        message: "Document uploaded successfully",
        data: {
          id: document._id.toString(),
          documentType: document.documentType,
          originalName: document.originalName,
          storedName: document.storedName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Document upload error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to upload document",
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

    const documents = await EmployeeDocument.find({
      employeeId,
    })
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({
      success: true,
      data: documents.map((document) => ({
        id: document._id.toString(),
        documentType: document.documentType,
        originalName: document.originalName,
        storedName: document.storedName,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        createdAt: document.createdAt,
      })),
    });
  } catch (error) {
    console.error("Document GET error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to load documents",
      },
      { status: 500 }
    );
  }
}