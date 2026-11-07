import connectDB from "@/lib/mongodb";
import EmployeeDocument from "@/models/EmployeeDocument";
import fs from "fs/promises";
import path from "path";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const document = await EmployeeDocument.findById(id).lean();

    if (!document) {
      return Response.json(
        {
          success: false,
          message: "Document not found",
        },
        { status: 404 }
      );
    }

    const filePath = path.join(
      process.cwd(),
      document.filePath
    );

    try {
      await fs.access(filePath);
    } catch {
      return Response.json(
        {
          success: false,
          message: "File not found on server",
        },
        { status: 404 }
      );
    }

    const file = await fs.readFile(filePath);

    return new Response(file, {
      status: 200,
      headers: {
        "Content-Type": document.mimeType,
        "Content-Disposition": `inline; filename="${document.originalName}"`,
      },
    });
  } catch (error) {
    console.error("Document preview error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to load document",
      },
      { status: 500 }
    );
  }
}


// DELETE
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const document =
      await EmployeeDocument.findById(id);

    if (!document) {
      return Response.json(
        {
          success: false,
          message: "Document not found",
        },
        { status: 404 }
      );
    }

    const actualFilePath = path.join(
      process.cwd(),
      document.filePath
    );

    try {
      await fs.unlink(actualFilePath);
    } catch (fileError) {
      if (fileError.code !== "ENOENT") {
        throw fileError;
      }
    }

    await EmployeeDocument.findByIdAndDelete(id);

    return Response.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Document delete error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete document",
      },
      { status: 500 }
    );
  }
}