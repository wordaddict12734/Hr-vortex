"use client";

import { useEffect, useRef, useState } from "react";
import {useRouter} from "next/navigation";
import {
  FiFileText,
  FiUploadCloud,
  FiCheckCircle,
  FiTrash2,
  FiEye,
  FiImage,
  FiAward,
  FiArrowRight,
} from "react-icons/fi";

const documentTypes = [
  {
    id: "class10",
    title: "Class 10 Marksheet",
    subtitle: "Secondary education",
    icon: FiFileText,
    accept: ".jpg,.jpeg,.png,.pdf",
    types: "JPG, PNG, PDF",
  },
  {
    id: "class12",
    title: "Class 12 Marksheet",
    subtitle: "Higher secondary education",
    icon: FiFileText,
    accept: ".jpg,.jpeg,.png,.pdf",
    types: "JPG, PNG, PDF",
  },
  {
    id: "passportPhoto",
    title: "Passport Size Photo",
    subtitle: "Recent photograph",
    icon: FiImage,
    accept: ".jpg,.jpeg,.png",
    types: "JPG, PNG",
  },
  {
    id: "aadhaar",
    title: "Aadhaar Card",
    subtitle: "Identity document",
    icon: FiFileText,
    accept: ".jpg,.jpeg,.png,.pdf",
    types: "JPG, PNG, PDF",
  },
  {
    id: "degree",
    title: "Degree Certificate",
    subtitle: "Graduation certificate",
    icon: FiAward,
    accept: ".jpg,.jpeg,.png,.pdf",
    types: "JPG, PNG, PDF",
  },
];

export default function DocumentsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  /*DOCUMENT STATE*/

  const [documents, setDocuments] = useState({
    class10: null,
    class12: null,
    passportPhoto: null,
    aadhaar: null,
    degree: null,
  });

  /*UPLOAD STATE*/

  const [uploading, setUploading] = useState({
    class10: false,
    class12: false,
    passportPhoto: false,
    aadhaar: false,
    degree: false,
  });

  const [uploaded, setUploaded] = useState({
    class10: null,
    class12: null,
    passportPhoto: null,
    aadhaar: null,
    degree: null,
  });

  const [savedDocuments, setSavedDocuments] = useState({
  class10: null,
  class12: null,
  passportPhoto: null,
  aadhaar: null,
  degree: null,
});

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fileInputs = useRef({});

  /*GET API*/
  useEffect(() => {
  if (!user?.id) return;

  const loadDocuments = async () => {
  try {
    setError("");

    const response = await fetch(
      `/api/employee/documents?employeeId=${user.id}`
    ); /*GET API*/

    const data = await response.json();

    if (!response.ok) {
      setError(
        data.message || "Failed to load documents."
      );
      return;
    }

    const uploadedDocuments = {};
    const savedDocumentDetails = {};

    data.data.forEach((document) => {
      uploadedDocuments[document.documentType] =
        document.id;

      savedDocumentDetails[document.documentType] =
        document;
    });

    setUploaded((previous) => ({
      ...previous,
      ...uploadedDocuments,
    }));

    setSavedDocuments((previous) => ({
      ...previous,
      ...savedDocumentDetails,
    }));
  } catch (error) {
    console.error(
      "Load documents error:",
      error
    );

    setError(
      "Unable to load your documents."
    );
  }
};

  loadDocuments();
}, [user]);

  /*GET LOGGED-IN USER*/

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      setUser(parsedUser);
    } catch (error) {
      console.error(
        "Failed to read user:",
        error
      );
    }
  }, []);

  /*UPLOAD DOCUMENT*/

  const uploadDocument = async (
    documentId,
    file
  ) => {
    if (!user?.id || !file) {
      setError("Employee information is missing.");
      return false;
    }

    try {
      setUploading((previous) => ({
        ...previous,
        [documentId]: true,
      }));

      setMessage("");
      setError("");

      const formData = new FormData();

      formData.append(
        "employeeId",
        user.id
      );

      formData.append(
        "documentType",
        documentId
      );

      formData.append(
        "file",
        file
      );

      const response = await fetch(
        "/api/employee/documents",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to upload document."
        );

        return false;
      }

      setUploaded((previous) => ({
        ...previous,
        [documentId]: data.data.id,
      }));

      setMessage(
        `${file.name} uploaded successfully.`
      );

      return true;
    } catch (error) {
      console.error(
        "Document upload error:",
        error
      );

      setError(
        "Unable to upload the document."
      );

      return false;
    } finally {
      setUploading((previous) => ({
        ...previous,
        [documentId]: false,
      }));
    }
  };

  /*FILE SELECTION*/

  const handleFileChange = async (
    documentId,
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "File size must be less than or equal to 5 MB."
      );

      event.target.value = "";

      return;
    }

    /*
      Show selected file
      immediately in the UI
    */

    setDocuments((previous) => ({
      ...previous,
      [documentId]: file,
    }));

    /*
      Upload the file
      to the backend
    */

    await uploadDocument(
      documentId,
      file
    );
  };

  /*REMOVE FILE*/

  const removeFile = async (documentId) => {
  const mongoDocumentId = uploaded[documentId];

  if (!mongoDocumentId) {
    setDocuments((previous) => ({
      ...previous,
      [documentId]: null,
    }));

    setSavedDocuments((previous) => ({
      ...previous,
      [documentId]: null,
    }));

    return;
  }

  try {
    setMessage("");
    setError("");

    const response = await fetch(
      `/api/employee/documents/${mongoDocumentId}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(
        data.message ||
          "Failed to delete document."
      );

      return;
    }

    // Remove temporary File object
    setDocuments((previous) => ({
      ...previous,
      [documentId]: null,
    }));

    // Remove MongoDB document ID
    setUploaded((previous) => ({
      ...previous,
      [documentId]: null,
    }));

    // Remove saved document information
    setSavedDocuments((previous) => ({
      ...previous,
      [documentId]: null,
    }));

    // Clear file input
    if (fileInputs.current[documentId]) {
      fileInputs.current[documentId].value = "";
    }

    setMessage(
      "Document deleted successfully."
    );
  } catch (error) {
    console.error(
      "Document delete error:",
      error
    );

    setError(
      "Unable to delete the document."
    );
  }
};

  /*OPEN FILE*/

const openFile = (documentId) => {
  const mongoDocumentId = uploaded[documentId];

  if (!mongoDocumentId) {
    setError("Document is not available.");
    return;
  }

  window.open(
    `/api/employee/documents/${mongoDocumentId}`,
    "_blank"
  );
};

  /*PROGRESS*/

  const uploadedCount =
    Object.values(uploaded).filter(
      (value) => value !== null
    ).length;

  const uploadingCount = Object.values(uploading).filter((value) => value === true).length;

  const totalDocuments = documentTypes.length;

  const progress = (uploadedCount / totalDocuments) * 100;

  /*SAVE / CONTINUE*/

  const handleContinue = () => {
    if (
      uploadedCount <
      totalDocuments
    ) {
      setError(
        "Please upload all required documents before continuing."
      );

      return;
    }

    setError("");
    router.push("/employee/profile");
  };

  return (
    <div className="text-white">

      {/*     HEADER */}

      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="flex items-center gap-2 text-xs font-semibold tracking-[2px] text-blue-400">

            <FiFileText size={14} />

            EMPLOYEE DOCUMENTS

          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Documents & Information
          </h1>

          <p className="mt-2 text-sm text-[#7891a8]">
            Upload your documents to complete your employee information.
          </p>

        </div>

      </div>

      {/*     MAIN GRID */}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">

        {/*       DOCUMENT SECTION*/}

        <div className="rounded-2xl border border-blue-100/10 bg-[#0b1d2d]">

          {/* SECTION HEADER */}

          <div className="border-b border-blue-100/10 px-6 py-5">

            <h2 className="text-base font-semibold text-white">
              Important Documents
            </h2>

            <p className="mt-1 text-xs text-[#6f879b]">
              Please upload clear and valid copies of your documents.
              Maximum file size is 5 MB.
            </p>

          </div>

          {/* DOCUMENT GRID */}

          <div className="grid gap-4 p-5 md:grid-cols-2">

            {documentTypes.map(
              (document) => {

                const file =documents[document.id];

                  const savedDocument = savedDocuments[document.id];

                const Icon =
                  document.icon;

                const isUploading =
                  uploading[
                    document.id
                  ];

                const isUploaded =
                  uploaded[
                    document.id
                  ];

                return (
                  <div
                    key={
                      document.id
                    }
                    className="rounded-2xl border border-blue-100/10 bg-[#081a2a] p-4 transition hover:border-blue-400/20"
                  >

                    {/* CARD HEADER */}

                    <div className="flex items-start gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">

                        <Icon size={19} />

                      </div>

                      <div className="min-w-0">

                        <h3 className="text-sm font-semibold text-white">
                          {document.title}
                        </h3>

                        <p className="mt-0.5 text-xs text-[#60788c]">
                          {document.subtitle}
                        </p>

                      </div>

                    </div>

                    {/* FILE INPUT */}

                    <input
                      ref={(element) => {
                        fileInputs.current[
                          document.id
                        ] = element;
                      }}
                      type="file"
                      accept={
                        document.accept
                      }
                      className="hidden"
                      onChange={(
                        event
                      ) =>
                        handleFileChange(
                          document.id,
                          event
                        )
                      }
                    />

                    {!file && !savedDocument ? (

                      /*                    UPLOAD AREA
                      ========================= */

                      <button
                        type="button"
                        onClick={() =>
                          fileInputs.current[
                            document.id
                          ]?.click()
                        }
                        disabled={
                          isUploading
                        }
                        className="mt-4 flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-blue-400/20 bg-blue-500/[0.025] px-4 py-7 text-center transition hover:border-blue-400/40 hover:bg-blue-500/[0.05] disabled:cursor-not-allowed disabled:opacity-50"
                      >

                        <FiUploadCloud
                          size={23}
                          className="text-blue-400"
                        />

                        <p className="mt-2 text-xs font-medium text-[#a9bbca]">
                          Click to upload
                        </p>

                        <p className="mt-1 text-[10px] text-[#60788c]">
                          {
                            document.types
                          }{" "}
                          · Max 5 MB
                        </p>

                      </button>

                    ) : (

                      /*                   UPLOADED FILE
                      ========================= */

                      <div className="mt-4 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.04] p-3">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                            <FiFileText size={17} />
                          </div>

                          <div className="min-w-0 flex-1">

                            <p className="truncate text-xs font-medium text-[#d7e2eb]">
                              {file?.name ||
                                savedDocument?.originalName}
                            </p>

                            <div className="mt-1 flex items-center gap-1.5">

                              {isUploading ? (

                                <span className="text-[10px] text-blue-400">
                                  Uploading...
                                </span>

                              ) : isUploaded ? (

                                <>
                                  <FiCheckCircle
                                    size={12}
                                    className="text-emerald-400"
                                  />

                                  <span className="text-[10px] text-emerald-400">
                                    Uploaded
                                  </span>
                                </>

                              ) : (

                                <span className="text-[10px] text-yellow-400">
                                  Selected
                                </span>

                              )}

                              <span className="text-[10px] text-[#60788c]">
                                ·
                              </span>

                              <span className="text-[10px] text-[#60788c]">
                                {file
                                  ? (
                                      file.size /
                                      (1024 * 1024)
                                    ).toFixed(2)
                                  : savedDocument
                                  ? (
                                      savedDocument.fileSize /
                                      (1024 * 1024)
                                    ).toFixed(2)
                                  : "0.00"}{" "}
                                MB
                              </span>

                            </div>

                          </div>

                        </div>

                        {/* FILE ACTIONS */}

                        <div className="mt-3 flex items-center gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              openFile(document.id)
                            }
                            className="flex items-center gap-1.5 rounded-lg border border-blue-100/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-[#9db1c1] transition hover:bg-white/[0.06] hover:text-white"
                          >

                            <FiEye
                              size={13}
                            />

                            Preview

                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              removeFile(document.id)
                            }
                            disabled={
                              isUploading
                            }
                            className="flex items-center gap-1.5 rounded-lg border border-red-400/10 bg-red-400/[0.04] px-3 py-1.5 text-[11px] font-medium text-red-400 transition hover:bg-red-400/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                          >

                            <FiTrash2
                              size={13}
                            />

                            Remove

                          </button>

                        </div>

                      </div>

                    )}

                  </div>
                );
              }
            )}

          </div>

          {/*         SAVE / CONTINUE*/}

          <div className="border-t border-blue-100/10 p-5">

            {message && (
              <div className="mb-4 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] px-4 py-3 text-xs font-medium text-emerald-300">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-xl border border-red-400/15 bg-red-400/[0.05] px-4 py-3 text-xs font-medium text-red-300">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleContinue}
              disabled={uploadedCount < totalDocuments || uploadingCount > 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(37,99,235,0.18)] transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue to Profile
              <FiArrowRight
                size={16}
              />

            </button>

          </div>

        </div>

        {/*RIGHT SIDEBAR*/}

        <div className="space-y-5">

          {/*         PROGRESS*/}

          <div className="rounded-2xl border border-blue-100/10 bg-[#0b1d2d] p-5">

            <h2 className="text-base font-semibold text-white">
              Onboarding Progress
            </h2>

            <div className="mt-5 flex items-center gap-5">

              {/* CIRCLE */}

              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-[7px] border-blue-500/20">

                <div className="absolute inset-[-7px] rounded-full border-[7px] border-transparent border-t-blue-500 border-r-violet-500" />

                <div className="text-center">

                  <p className="text-xl font-bold text-white">
                    {uploadedCount}/
                    {totalDocuments}
                  </p>

                  <p className="text-[10px] text-[#7891a8]">
                    Completed
                  </p>

                </div>

              </div>

              <div>

                <p className="text-sm font-semibold text-blue-400">

                  {uploadedCount ===
                  totalDocuments
                    ? "All documents uploaded!"
                    : "Documents pending"}

                </p>

                <p className="mt-1 text-xs leading-5 text-[#7891a8]">

                  {uploadedCount ===
                  totalDocuments
                    ? "All required documents are stored successfully."
                    : `${
                        totalDocuments -
                        uploadedCount
                      } document${
                        totalDocuments -
                          uploadedCount ===
                        1
                          ? ""
                          : "s"
                      } remaining.`}

                </p>

              </div>

            </div>

            {/* PROGRESS BAR */}

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.06]">

              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-500 transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

            <p className="mt-2 text-right text-[10px] text-[#60788c]">
              {Math.round(
                progress
              )}
              % complete
            </p>

          </div>

          {/*CHECKLIST*/}

          <div className="rounded-2xl border border-blue-100/10 bg-[#0b1d2d] p-5">

            <h2 className="text-base font-semibold text-white">
              Document Checklist
            </h2>

            <div className="mt-4 space-y-3">

              {documentTypes.map(
                (document) => {

                  const isUploaded =
                    uploaded[
                      document.id
                    ];

                  return (
                    <div
                      key={
                        document.id
                      }
                      className="flex items-center gap-3"
                    >

                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          isUploaded
                            ? "bg-emerald-400 text-[#071421]"
                            : "border border-[#49657c] text-transparent"
                        }`}
                      >

                        {isUploaded && (
                          <FiCheckCircle
                            size={13}
                          />
                        )}

                      </div>

                      <span
                        className={`text-xs ${
                          isUploaded
                            ? "text-[#a9bbca]"
                            : "text-[#60788c]"
                        }`}
                      >
                        {
                          document.title
                        }
                      </span>

                    </div>
                  );
                }
              )}

            </div>

          </div>

          {/*         TIPS*/}

          <div className="rounded-2xl border border-blue-100/10 bg-[#0b1d2d] p-5">

            <h2 className="text-base font-semibold text-white">
              Upload Guidelines
            </h2>

            <ul className="mt-4 space-y-3 text-xs leading-5 text-[#7891a8]">

              <li className="flex gap-2">

                <span className="text-blue-400">
                  •
                </span>

                Make sure all documents are clear and readable.

              </li>

              <li className="flex gap-2">

                <span className="text-blue-400">
                  •
                </span>

                Use JPG, PNG or PDF where supported.

              </li>

              <li className="flex gap-2">

                <span className="text-blue-400">
                  •
                </span>

                Each file should be under 5 MB.

              </li>

              <li className="flex gap-2">

                <span className="text-blue-400">
                  •
                </span>

                Make sure your name and document details are visible.

              </li>

            </ul>

          </div>

        </div>

      </div>

    </div>
  );
}