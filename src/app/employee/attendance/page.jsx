"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  FiClock,
  FiLogIn,
  FiLogOut,
  FiCalendar,
  FiCheckCircle,
  FiActivity,
  FiArrowUpRight,
} from "react-icons/fi";

export default function AttendancePage() {
  const router = useRouter();

  /*USER*/

  const [user] = useState(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Failed to read user:", error);
      return null;
    }
  });

  /*STATE*/

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  /*CHECK LOGIN*/

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    if (user.role !== "employee") {
      router.push("/");
    }
  }, [user, router]);

  /*GET TODAY'S DATE*/

  const getToday = () => {
    const now = new Date();

    const year = now.getFullYear();

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /*LOAD ATTENDANCE*/

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadAttendance = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/employee/attendance?employeeId=${user.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load attendance"
          );
        }

        if (!cancelled) {
          setAttendance(data.data || []);
        }
      } catch (error) {
        console.error("Attendance loading error:", error);

        if (!cancelled) {
          setError("Unable to load attendance.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAttendance();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  /*CHECK IN / CHECK OUT*/

  const handleAttendance = async (action) => {
    if (!user?.id) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        "/api/employee/attendance",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            employeeId: user.id,
            action,
            workDate: getToday(),
            currentTime: new Date().toISOString(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Something went wrong."
        );

        return;
      }

      setMessage(
        data.message ||
          `${
            action === "check-in"
              ? "Checked in"
              : "Checked out"
          } successfully.`
      );

      const attendanceResponse = await fetch(
        `/api/employee/attendance?employeeId=${user.id}`
      );

      const attendanceData =
        await attendanceResponse.json();

      if (attendanceResponse.ok) {
        setAttendance(
          attendanceData.data || []
        );
      }
    } catch (error) {
      console.error(
        "Attendance action error:",
        error
      );

      setError(
        "Unable to connect to the server."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /*TODAY'S RECORD*/

  const today = getToday();

  const todayRecord = attendance.find(
    (record) => record.workDate === today
  );

  /*FORMAT TIME*/

  const formatTime = (date) => {
    if (!date) {
      return "--";
    }

    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /*FORMAT DATE*/

  const formatDate = (date) => {
    if (!date) {
      return "--";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /*FORMAT WORKED TIME*/

  const formatWorkedTime = (minutes) => {
    if (!minutes || minutes <= 0) {
      return "0h 0m";
    }

    const hours = Math.floor(minutes / 60);

    const remainingMinutes = minutes % 60;

    return `${hours}h ${remainingMinutes}m`;
  };

  /*THIS WEEK*/

  const thisWeekMinutes = useMemo(() => {
    const now = new Date();

    const day = now.getDay();

    const difference = day === 0 ? 6 : day - 1;

    const monday = new Date(now);

    monday.setDate(
      now.getDate() - difference
    );

    monday.setHours(0, 0, 0, 0);

    return attendance.reduce(
      (total, record) => {
        const recordDate = new Date(
          `${record.workDate}T00:00:00`
        );

        if (recordDate >= monday) {
          return (
            total +
            (record.workedMinutes || 0)
          );
        }

        return total;
      },
      0
    );
  }, [attendance]);

  /*THIS MONTH*/

  const thisMonthMinutes = useMemo(() => {
    const now = new Date();

    return attendance.reduce(
      (total, record) => {
        const recordDate = new Date(
          `${record.workDate}T00:00:00`
        );

        const sameMonth =
          recordDate.getMonth() ===
          now.getMonth();

        const sameYear =
          recordDate.getFullYear() ===
          now.getFullYear();

        if (sameMonth && sameYear) {
          return (
            total +
            (record.workedMinutes || 0)
          );
        }

        return total;
      },
      0
    );
  }, [attendance]);

  /*LOADING*/

  if (!user || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-sm text-[#7891a8]">
          Loading attendance...
        </p>
      </div>
    );
  }

  /*PAGE*/

  return (
    <div className="text-white">

      {/*     HEADER*/}

      <div className="mb-8">

        <div className="flex items-center gap-2 text-xs font-semibold tracking-[2px] text-blue-400">
          <FiClock size={14} />
          ATTENDANCE
        </div>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
          My Attendance
        </h1>

        <p className="mt-2 text-sm text-[#7891a8]">
          Track your daily attendance and working
          hours.
        </p>

      </div>

      {/*     MESSAGES*/}

      {message && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-3 text-sm font-medium text-emerald-400">
          <FiCheckCircle size={17} />
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/[0.07] px-4 py-3 text-sm font-medium text-red-400">
          {error}
        </div>
      )}

      {/*     SUMMARY*/}

      <div className="grid gap-4 md:grid-cols-3">

        {/* TODAY */}

        <div className="group rounded-2xl border border-blue-100/10 bg-[#0b1d2d] p-5 transition hover:border-blue-400/20">

          <div className="flex items-start justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <FiClock size={20} />
            </div>

            <FiArrowUpRight
              size={17}
              className="text-[#49657c] transition group-hover:text-blue-400"
            />

          </div>

          <p className="mt-6 text-xs font-medium uppercase tracking-[1px] text-[#6f879b]">
            Today
          </p>

          <h2 className="mt-1 text-2xl font-bold text-white">
            {formatWorkedTime(
              todayRecord?.workedMinutes
            )}
          </h2>

          <p className="mt-1 text-xs text-[#60788c]">
            Working hours
          </p>

        </div>

        {/* WEEK */}

        <div className="group rounded-2xl border border-blue-100/10 bg-[#0b1d2d] p-5 transition hover:border-blue-400/20">

          <div className="flex items-start justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <FiActivity size={20} />
            </div>

            <FiArrowUpRight
              size={17}
              className="text-[#49657c] transition group-hover:text-violet-400"
            />

          </div>

          <p className="mt-6 text-xs font-medium uppercase tracking-[1px] text-[#6f879b]">
            This Week
          </p>

          <h2 className="mt-1 text-2xl font-bold text-white">
            {formatWorkedTime(
              thisWeekMinutes
            )}
          </h2>

          <p className="mt-1 text-xs text-[#60788c]">
            Total working hours
          </p>

        </div>

        {/* MONTH */}

        <div className="group rounded-2xl border border-blue-100/10 bg-[#0b1d2d] p-5 transition hover:border-blue-400/20">

          <div className="flex items-start justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <FiCalendar size={20} />
            </div>

            <FiArrowUpRight
              size={17}
              className="text-[#49657c] transition group-hover:text-emerald-400"
            />

          </div>

          <p className="mt-6 text-xs font-medium uppercase tracking-[1px] text-[#6f879b]">
            This Month
          </p>

          <h2 className="mt-1 text-2xl font-bold text-white">
            {formatWorkedTime(
              thisMonthMinutes
            )}
          </h2>

          <p className="mt-1 text-xs text-[#60788c]">
            Total working hours
          </p>

        </div>

      </div>

      {/*     TODAY'S ATTENDANCE*/}

      <div className="mt-5 rounded-2xl border border-blue-100/10 bg-[#0b1d2d]">

        {/* TOP */}

        <div className="flex flex-col gap-5 border-b border-blue-100/10 p-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <FiCalendar size={17} />
              </div>

              <div>

                <h2 className="text-base font-semibold text-white">
                  Today&apos;s Attendance
                </h2>

                <p className="mt-0.5 text-xs text-[#6f879b]">
                  {formatDate(today)}
                </p>

              </div>

            </div>

          </div>

          {/* BUTTONS */}

          <div className="flex gap-3">

            <button
              type="button"
              disabled={
                actionLoading ||
                !!todayRecord
              }
              onClick={() =>
                handleAttendance("check-in")
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(37,99,235,0.18)] transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <FiLogIn size={17} />

              {actionLoading
                ? "Processing..."
                : "Check In"}
            </button>

            <button
              type="button"
              disabled={
                actionLoading ||
                !todayRecord ||
                !!todayRecord.checkOut
              }
              onClick={() =>
                handleAttendance("check-out")
              }
              className="flex items-center justify-center gap-2 rounded-xl border border-blue-100/10 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-[#a5b8c8] transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <FiLogOut size={17} />

              Check Out
            </button>

          </div>

        </div>

        {/* TODAY DETAILS */}

        <div className="grid grid-cols-1 divide-y divide-blue-100/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">

          {/* CHECK IN */}

          <div className="p-6">

            <p className="text-xs uppercase tracking-[1px] text-[#60788c]">
              Check In
            </p>

            <p className="mt-2 text-xl font-semibold text-white">
              {formatTime(
                todayRecord?.checkIn
              )}
            </p>

            <p className="mt-1 text-xs text-[#60788c]">
              Start time
            </p>

          </div>

          {/* CHECK OUT */}

          <div className="p-6">

            <p className="text-xs uppercase tracking-[1px] text-[#60788c]">
              Check Out
            </p>

            <p className="mt-2 text-xl font-semibold text-white">
              {formatTime(
                todayRecord?.checkOut
              )}
            </p>

            <p className="mt-1 text-xs text-[#60788c]">
              End time
            </p>

          </div>

          {/* WORKED */}

          <div className="p-6">

            <p className="text-xs uppercase tracking-[1px] text-[#60788c]">
              Total Worked
            </p>

            <p className="mt-2 text-xl font-semibold text-white">
              {formatWorkedTime(
                todayRecord?.workedMinutes
              )}
            </p>

            <p className="mt-1 text-xs text-[#60788c]">
              Today&apos;s duration
            </p>

          </div>

        </div>

      </div>

      {/*     HISTORY*/}

      <div className="mt-5 overflow-hidden rounded-2xl border border-blue-100/10 bg-[#0b1d2d]">

        {/* HEADER */}

        <div className="border-b border-blue-100/10 px-6 py-5">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-base font-semibold text-white">
                Attendance History
              </h2>

              <p className="mt-1 text-xs text-[#6f879b]">
                Your previous attendance records.
              </p>

            </div>

            <div className="hidden h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 sm:flex">
              <FiClock size={17} />
            </div>

          </div>

        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[650px]">

            <thead>

              <tr className="border-b border-blue-100/10 bg-white/[0.015]">

                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[1.2px] text-[#60788c]">
                  Date
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[1.2px] text-[#60788c]">
                  Check In
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[1.2px] text-[#60788c]">
                  Check Out
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[1.2px] text-[#60788c]">
                  Worked
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[1.2px] text-[#60788c]">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {attendance.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="px-6 py-14 text-center"
                  >

                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] text-[#60788c]">
                      <FiCalendar size={19} />
                    </div>

                    <p className="mt-3 text-sm text-[#7891a8]">
                      No attendance records found.
                    </p>

                  </td>

                </tr>

              ) : (

                attendance.map((record) => (

                  <tr
                    key={record.id}
                    className="border-b border-blue-100/[0.06] transition last:border-0 hover:bg-white/[0.025]"
                  >

                    <td className="px-6 py-4 text-sm font-medium text-[#d7e2eb]">
                      {formatDate(
                        record.workDate
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-[#9db1c1]">
                      {formatTime(
                        record.checkIn
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-[#9db1c1]">
                      {formatTime(
                        record.checkOut
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-white">
                      {formatWorkedTime(
                        record.workedMinutes
                      )}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${
                          record.status ===
                          "completed"
                            ? "border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-400"
                            : "border-blue-400/15 bg-blue-400/[0.07] text-blue-400"
                        }`}
                      >

                        <FiCheckCircle
                          size={12}
                        />

                        {record.status ===
                        "completed"
                          ? "Completed"
                          : "Checked In"}

                      </span>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}