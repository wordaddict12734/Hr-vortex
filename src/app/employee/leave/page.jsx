"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiCalendar,
  FiClock,
  FiFileText,
  FiArrowLeft,
  FiSend,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";

export default function LeavePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const [form, setForm] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const [leaveRequests, setLeaveRequests] = useState([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =========================
     CHECK LOGIN
  ========================= */

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.role !== "employee") {
        router.push("/login");
        return;
      }

      setUser(parsedUser);
      setLoadingPage(false);

      fetchLeaveRequests(parsedUser.id);
    } catch (error) {
      console.error("User parsing error:", error);
      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [router]);

  /* =========================
     GET LEAVE REQUESTS
  ========================= */

  const fetchLeaveRequests = async (employeeId) => {
    try {
      setLoadingRequests(true);

      const response = await fetch(
        `/api/employee/leave?employeeId=${employeeId}`
      );

      const data = await response.json();

      if (data.success) {
        setLeaveRequests(data.data);
      } else {
        setError(data.message || "Failed to load leave requests");
      }
    } catch (error) {
      console.error("Fetch leave requests error:", error);
      setError("Unable to load leave requests");
    } finally {
      setLoadingRequests(false);
    }
  };

  /* =========================
     HANDLE INPUT
  ========================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  /* =========================
     CALCULATE DURATION
  ========================= */

  const calculateDuration = () => {
    if (!form.fromDate || !form.toDate) {
      return 0;
    }

    const from = new Date(`${form.fromDate}T00:00:00`);
    const to = new Date(`${form.toDate}T00:00:00`);

    if (to < from) {
      return 0;
    }

    const difference = to.getTime() - from.getTime();

    return Math.floor(
      difference / (1000 * 60 * 60 * 24)
    ) + 1;
  };

  const duration = calculateDuration();

  /* =========================
     SUBMIT LEAVE REQUEST
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!form.leaveType) {
      setError("Please select a leave type.");
      return;
    }

    if (!form.fromDate || !form.toDate) {
      setError("Please select both start and end dates.");
      return;
    }

    if (form.toDate < form.fromDate) {
      setError("To date cannot be earlier than from date.");
      return;
    }

    if (!form.reason.trim()) {
      setError("Please enter a reason for your leave.");
      return;
    }

    if (form.reason.trim().length < 5) {
      setError("Please provide a proper reason for your leave.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/employee/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: user.id,
          leaveType: form.leaveType,
          fromDate: form.fromDate,
          toDate: form.toDate,
          reason: form.reason.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to submit leave request.");
        return;
      }

      setMessage("Leave request submitted successfully.");

      setForm({
        leaveType: "",
        fromDate: "",
        toDate: "",
        reason: "",
      });

      await fetchLeaveRequests(user.id);
    } catch (error) {
      console.error("Submit leave error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================
     STATUS UI
  ========================= */

  const getStatus = (status) => {
    switch (status) {
      case "approved":
        return {
          label: "Approved",
          icon: <FiCheckCircle />,
          className:
            "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        };

      case "rejected":
        return {
          label: "Rejected",
          icon: <FiXCircle />,
          className:
            "bg-red-500/10 text-red-400 border-red-500/20",
        };

      default:
        return {
          label: "Pending",
          icon: <FiClock />,
          className:
            "bg-amber-500/10 text-amber-400 border-amber-500/20",
        };
    }
  };

  /* =========================
     FORMAT DATE
  ========================= */

  const formatDate = (date) => {
    if (!date) return "-";

    const value = new Date(`${date}T00:00:00`);

    return value.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =========================
     CALCULATE REQUEST DURATION
  ========================= */

  const getRequestDuration = (fromDate, toDate) => {
    const from = new Date(`${fromDate}T00:00:00`);
    const to = new Date(`${toDate}T00:00:00`);

    const difference = to.getTime() - from.getTime();

    return (
      Math.floor(
        difference / (1000 * 60 * 60 * 24)
      ) + 1
    );
  };

  if (loadingPage) {
    return (
      <div className="min-h-screen bg-[#071421] flex items-center justify-center">
        <FiLoader className="text-blue-400 text-2xl animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071421] text-white p-6 md:p-8">

      {/* =========================
          HEADER
      ========================= */}

      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-8">

          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => router.push("/employee")}
                className="w-9 h-9 rounded-lg bg-[#102335] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#162d42] transition"
              >
                <FiArrowLeft />
              </button>

              <h1 className="text-2xl md:text-3xl font-semibold">
                Request Leave
              </h1>
            </div>

            <p className="text-gray-400 text-sm ml-12">
              Submit a leave request and track its approval status.
            </p>
          </div>

        </div>

        {/* =========================
            MAIN GRID
        ========================= */}

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">

          {/* =========================
              LEAVE FORM
          ========================= */}

          <div className="bg-[#0b1d2d] border border-white/10 rounded-2xl p-6 h-fit">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <FiCalendar size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-lg">
                  Apply for Leave
                </h2>

                <p className="text-gray-500 text-xs">
                  Fill in the details below
                </p>
              </div>

            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* LEAVE TYPE */}

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Leave Type
                </label>

                <div className="relative">

                  <FiFileText
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={17}
                  />

                  <select
                    name="leaveType"
                    value={form.leaveType}
                    onChange={handleChange}
                    className="w-full appearance-none bg-[#102335] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition"
                  >
                    <option value="">
                      Select leave type
                    </option>

                    <option value="Casual Leave">
                      Casual Leave
                    </option>

                    <option value="Sick Leave">
                      Sick Leave
                    </option>

                    <option value="Earned Leave">
                      Earned Leave
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>

                </div>
              </div>

              {/* DATE GRID */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    From Date
                  </label>

                  <input
                    type="date"
                    name="fromDate"
                    value={form.fromDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-[#102335] border border-white/10 rounded-xl px-3 py-3 text-sm text-white outline-none focus:border-blue-500 transition [color-scheme:dark]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    To Date
                  </label>

                  <input
                    type="date"
                    name="toDate"
                    value={form.toDate}
                    onChange={handleChange}
                    min={
                      form.fromDate ||
                      new Date().toISOString().split("T")[0]
                    }
                    className="w-full bg-[#102335] border border-white/10 rounded-xl px-3 py-3 text-sm text-white outline-none focus:border-blue-500 transition [color-scheme:dark]"
                  />
                </div>

              </div>

              {/* DURATION */}

              {duration > 0 && (
                <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">

                  <div className="flex items-center gap-2 text-blue-300 text-sm">
                    <FiClock />
                    Leave Duration
                  </div>

                  <span className="font-semibold text-blue-400">
                    {duration}{" "}
                    {duration === 1 ? "Day" : "Days"}
                  </span>

                </div>
              )}

              {/* REASON */}

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Reason
                </label>

                <textarea
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  rows={5}
                  maxLength={500}
                  placeholder="Enter the reason for your leave..."
                  className="w-full resize-none bg-[#102335] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 transition"
                />

                <div className="text-right text-xs text-gray-600 mt-1">
                  {form.reason.length}/500
                </div>
              </div>

              {/* ERROR */}

              {error && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
                  <FiAlertCircle className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* SUCCESS */}

              {message && (
                <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl px-4 py-3 text-sm">
                  <FiCheckCircle className="mt-0.5 shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed rounded-xl py-3 text-sm font-medium transition"
              >
                {submitting ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiSend />
                    Submit Leave Request
                  </>
                )}
              </button>

            </form>
          </div>

          {/* =========================
              REQUEST HISTORY
          ========================= */}

          <div className="bg-[#0b1d2d] border border-white/10 rounded-2xl overflow-hidden">

            <div className="p-6 border-b border-white/10">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-lg font-semibold">
                    My Leave Requests
                  </h2>

                  <p className="text-gray-500 text-xs mt-1">
                    View your previous leave applications
                  </p>
                </div>

                <div className="px-3 py-1.5 rounded-lg bg-[#102335] text-xs text-gray-400">
                  {leaveRequests.length}{" "}
                  {leaveRequests.length === 1
                    ? "Request"
                    : "Requests"}
                </div>

              </div>

            </div>

            {/* LOADING */}

            {loadingRequests ? (
              <div className="flex items-center justify-center py-16 text-gray-500">
                <FiLoader className="animate-spin mr-2" />
                Loading requests...
              </div>
            ) : leaveRequests.length === 0 ? (

              /* EMPTY */

              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">

                <div className="w-14 h-14 rounded-2xl bg-[#102335] flex items-center justify-center text-gray-500 mb-4">
                  <FiCalendar size={24} />
                </div>

                <h3 className="text-gray-300 font-medium mb-1">
                  No leave requests yet
                </h3>

                <p className="text-gray-600 text-sm max-w-xs">
                  Your submitted leave requests will appear here.
                </p>

              </div>

            ) : (

              /* TABLE */

              <div className="overflow-x-auto">

                <table className="w-full text-sm">

                  <thead>
                    <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-wider">

                      <th className="text-left px-6 py-4 font-medium">
                        Leave Type
                      </th>

                      <th className="text-left px-6 py-4 font-medium">
                        Dates
                      </th>

                      <th className="text-left px-6 py-4 font-medium">
                        Duration
                      </th>

                      <th className="text-left px-6 py-4 font-medium">
                        Reason
                      </th>

                      <th className="text-left px-6 py-4 font-medium">
                        Status
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {leaveRequests.map((leave) => {

                      const status = getStatus(leave.status);

                      const requestDuration =
                        getRequestDuration(
                          leave.fromDate,
                          leave.toDate
                        );

                      return (
                        <tr
                          key={leave.id}
                          className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition"
                        >

                          {/* TYPE */}

                          <td className="px-6 py-5 align-top">

                            <div className="font-medium text-gray-200 whitespace-nowrap">
                              {leave.leaveType}
                            </div>

                          </td>

                          {/* DATES */}

                          <td className="px-6 py-5 align-top">

                            <div className="text-gray-300 whitespace-nowrap">
                              {formatDate(leave.fromDate)}
                            </div>

                            <div className="text-gray-600 text-xs my-1">
                              to
                            </div>

                            <div className="text-gray-300 whitespace-nowrap">
                              {formatDate(leave.toDate)}
                            </div>

                          </td>

                          {/* DURATION */}

                          <td className="px-6 py-5 align-top">

                            <span className="text-gray-300 whitespace-nowrap">
                              {requestDuration}{" "}
                              {requestDuration === 1
                                ? "day"
                                : "days"}
                            </span>

                          </td>

                          {/* REASON */}

                          <td className="px-6 py-5 align-top max-w-[220px]">

                            <p
                              className="text-gray-400 text-sm line-clamp-3"
                              title={leave.reason}
                            >
                              {leave.reason}
                            </p>

                            {leave.adminComment && (
                              <div className="mt-2 text-xs text-gray-600">
                                Admin:{" "}
                                <span className="text-gray-500">
                                  {leave.adminComment}
                                </span>
                              </div>
                            )}

                          </td>

                          {/* STATUS */}

                          <td className="px-6 py-5 align-top">

                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap ${status.className}`}
                            >
                              {status.icon}
                              {status.label}
                            </span>

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}