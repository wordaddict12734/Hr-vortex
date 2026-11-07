"use client";

import { useEffect, useState } from "react";

import {
  FiClipboard,
  FiCheck,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
} from "react-icons/fi";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [updatingId, setUpdatingId] = useState(null);

  
  // FETCH REQUESTS
  
  const fetchRequests = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/admin/requests?page=${page}&limit=5`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load requests"
        );
      }

      setRequests(data.data.requests);
      setCurrentPage(data.data.currentPage);
      setTotalPages(data.data.totalPages);
    } catch (error) {
      console.error("Requests error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  
  // LOAD REQUESTS
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchRequests(currentPage);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [currentPage]);

  
  // UPDATE STATUS
  
  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");

      const response = await fetch(
        `/api/admin/requests/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update request"
        );
      }

      await fetchRequests(currentPage);
    } catch (error) {
      console.error("Status update error:", error);
      setError(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  
  // FORMAT DATE
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  
  // STATUS STYLE
  
  const getStatusStyle = (status) => {
    if (status === "approved") {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }

    if (status === "rejected") {
      return "bg-red-500/10 text-red-400 border-red-500/20";
    }

    return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  };

  return (
    <section className="px-8 py-7 text-white">

      {/* HEADER */}
      <div className="mb-7 flex items-center justify-between">
        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <FiClipboard size={21} />
          </div>

          <div>
            <h1 className="text-[30px] font-semibold tracking-tight text-white">
              Employee Requests
            </h1>

            <p className="mt-1 text-sm text-[#819bb2]">
              Review and manage employee registration requests
            </p>
          </div>

        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* TABLE CARD */}
      <div className="overflow-hidden rounded-2xl border border-blue-300/10 bg-[#0a2037]">

        {/* TABLE HEADER */}
        <div className="flex items-center justify-between border-b border-blue-300/10 px-6 py-5">

          <div>
            <h2 className="text-[16px] font-semibold text-white">
              Registration Requests
            </h2>

            <p className="mt-1 text-xs text-[#718ba3]">
              Review employee registration submissions
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-400">
            <FiClock size={14} />
            Pending requests
          </div>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            <thead>
              <tr className="border-b border-blue-300/10">

                <th className="px-6 py-4 text-[11px] font-medium uppercase tracking-wide text-[#718ba3]">
                  Employee
                </th>

                <th className="px-6 py-4 text-[11px] font-medium uppercase tracking-wide text-[#718ba3]">
                  Email
                </th>

                <th className="px-6 py-4 text-[11px] font-medium uppercase tracking-wide text-[#718ba3]">
                  Phone
                </th>

                <th className="px-6 py-4 text-[11px] font-medium uppercase tracking-wide text-[#718ba3]">
                  Requested On
                </th>

                <th className="px-6 py-4 text-[11px] font-medium uppercase tracking-wide text-[#718ba3]">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-[11px] font-medium uppercase tracking-wide text-[#718ba3]">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {/* LOADING */}
              {loading ? (

                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-16 text-center text-sm text-[#718ba3]"
                  >
                    Loading requests...
                  </td>
                </tr>

              ) : requests.length === 0 ? (

                /* EMPTY STATE */
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-16 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <FiClipboard
                        size={30}
                        className="mb-3 text-[#3c5468]"
                      />

                      <p className="text-sm font-medium text-[#8da6bb]">
                        No registration requests found
                      </p>

                      <p className="mt-1 text-xs text-[#718ba3]">
                        New employee requests will appear here
                      </p>

                    </div>

                  </td>
                </tr>

              ) : (

                /* REQUEST ROWS */
                requests.map((request) => (

                  <tr
                    key={request.id}
                    className="border-b border-blue-300/[0.07] transition hover:bg-blue-400/[0.03]"
                  >

                    {/* EMPLOYEE */}
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/15 text-sm font-semibold text-blue-400">
                          {request.fullName
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>

                        <div>

                          <p className="text-sm font-semibold text-white">
                            {request.fullName}
                          </p>

                          <p className="mt-0.5 text-xs text-[#718ba3]">
                            Employee
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* EMAIL */}
                    <td className="px-6 py-5 text-sm text-[#8da6bb]">
                      {request.email}
                    </td>

                    {/* PHONE */}
                    <td className="px-6 py-5 text-sm text-[#8da6bb]">
                      {request.phone}
                    </td>

                    {/* DATE */}
                    <td className="px-6 py-5 text-sm text-[#718ba3]">
                      {formatDate(request.createdAt)}
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5">

                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize ${getStatusStyle(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>

                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-5">

                      {request.status === "pending" ? (

                        <div className="flex justify-end gap-2">

                          {/* APPROVE */}
                          <button
                            type="button"
                            disabled={
                              updatingId === request.id
                            }
                            onClick={() =>
                              updateStatus(
                                request.id,
                                "approved"
                              )
                            }
                            className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <FiCheck size={14} />
                            Approve
                          </button>

                          {/* REJECT */}
                          <button
                            type="button"
                            disabled={
                              updatingId === request.id
                            }
                            onClick={() =>
                              updateStatus(
                                request.id,
                                "rejected"
                              )
                            }
                            className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <FiX size={14} />
                            Reject
                          </button>

                        </div>

                      ) : (

                        <div className="text-right text-xs text-[#718ba3]">
                          No action
                        </div>

                      )}

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}
        {!loading && requests.length > 0 && (

          <div className="flex items-center justify-between border-t border-blue-300/10 px-6 py-4">

            <p className="text-xs text-[#718ba3]">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex items-center gap-2">

              {/* PREVIOUS */}
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(
                    (page) => page - 1
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-300/10 bg-[#0d2842] text-[#91a8bc] transition hover:bg-blue-400/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiChevronLeft size={17} />
              </button>

              {/* PAGE NUMBERS */}
              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (

                <button
                  key={page}
                  type="button"
                  onClick={() =>
                    setCurrentPage(page)
                  }
                  className={`h-9 min-w-9 rounded-lg px-3 text-xs font-medium transition ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "border border-blue-300/10 bg-[#0d2842] text-[#91a8bc] hover:bg-blue-400/[0.08]"
                  }`}
                >
                  {page}
                </button>

              ))}

              {/* NEXT */}
              <button
                type="button"
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (page) => page + 1
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-300/10 bg-[#0d2842] text-[#91a8bc] transition hover:bg-blue-400/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiChevronRight size={17} />
              </button>

            </div>

          </div>

        )}

      </div>

    </section>
  );
}