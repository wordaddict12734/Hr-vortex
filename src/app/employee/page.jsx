"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  FiCheckCircle,
  FiClock,
  FiUpload,
  FiCalendar,
  FiUser,
  FiFileText,
  FiHeadphones,
  FiCreditCard,
  FiBell,
  FiLogIn,
  FiLogOut,
} from "react-icons/fi";

export default function EmployeeDashboard() {
  const router = useRouter();

  /* =====================================
     USER
  ===================================== */

  const [user, setUser] = useState(null);

  /* =====================================
     ATTENDANCE
  ===================================== */

  const [todayAttendance, setTodayAttendance] = useState(null);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [attendanceActionLoading, setAttendanceActionLoading] =
    useState(false);

  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [attendanceError, setAttendanceError] = useState("");

  /* =====================================
     GET TODAY
  ===================================== */

  const getToday = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /* =====================================
     FORMAT TIME
  ===================================== */

  const formatTime = (date) => {
    if (!date) {
      return "--";
    }

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* =====================================
     FORMAT WORKED TIME
  ===================================== */

  const formatWorkedTime = (minutes) => {
    if (!minutes || minutes <= 0) {
      return "0h 00m";
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}h ${String(remainingMinutes).padStart(2, "0")}m`;
  };

  /* =====================================
     LOAD USER
  ===================================== */

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.role !== "employee") {
        router.push("/");
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      console.error("Failed to read user:", error);
      router.push("/");
    }
  }, [router]);

  /* =====================================
     LOAD TODAY'S ATTENDANCE
  ===================================== */

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    let cancelled = false;

    const loadTodayAttendance = async () => {
      try {
        setAttendanceLoading(true);
        setAttendanceError("");

        const response = await fetch(
          `/api/employee/attendance?employeeId=${user.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load attendance"
          );
        }

        const today = getToday();

        const record = (data.data || []).find(
          (item) => item.workDate === today
        );

        if (!cancelled) {
          setTodayAttendance(record || null);
        }
      } catch (error) {
        console.error(
          "Dashboard attendance loading error:",
          error
        );

        if (!cancelled) {
          setAttendanceError(
            "Unable to load today's attendance."
          );
        }
      } finally {
        if (!cancelled) {
          setAttendanceLoading(false);
        }
      }
    };

    loadTodayAttendance();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  /* =====================================
     CHECK IN / CHECK OUT
  ===================================== */

  const handleAttendance = async (action) => {
    if (!user?.id) {
      return;
    }

    try {
      setAttendanceActionLoading(true);
      setAttendanceMessage("");
      setAttendanceError("");

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
        setAttendanceError(
          data.message || "Something went wrong."
        );

        return;
      }

      setAttendanceMessage(
        data.message ||
          `${
            action === "check-in"
              ? "Checked in successfully."
              : "Checked out successfully."
          }`
      );

      /* GET UPDATED ATTENDANCE */

      const attendanceResponse = await fetch(
        `/api/employee/attendance?employeeId=${user.id}`
      );

      const attendanceData =
        await attendanceResponse.json();

      if (attendanceResponse.ok) {
        const today = getToday();

        const record = (attendanceData.data || []).find(
          (item) => item.workDate === today
        );

        setTodayAttendance(record || null);
      }
    } catch (error) {
      console.error(
        "Dashboard attendance action error:",
        error
      );

      setAttendanceError(
        "Unable to connect to the server."
      );
    } finally {
      setAttendanceActionLoading(false);
    }
  };

  /* =====================================
     LOADING USER
  ===================================== */

  if (!user) {
    return null;
  }

  /* =====================================
     ATTENDANCE STATUS
  ===================================== */

  const attendanceStatus = !todayAttendance
    ? "Not Checked In"
    : todayAttendance.checkOut
      ? "Completed"
      : "Checked In";

  return (
    <div className="mx-auto max-w-[1500px]">

      {/* =====================================
          WELCOME
      ===================================== */}

      <div className="mb-8">
        <p className="mb-2 text-sm font-medium tracking-[1px] text-blue-400">
          EMPLOYEE PORTAL
        </p>

        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Welcome back, {user.fullName}
        </h1>

        <p className="mt-2 text-sm text-[#7891a8]">
          Here&apos;s what&apos;s happening with your account today.
        </p>
      </div>

      {/* =====================================
          ATTENDANCE MESSAGES
      ===================================== */}

      {attendanceMessage && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-3 text-sm font-medium text-emerald-400">
          <FiCheckCircle size={17} />
          {attendanceMessage}
        </div>
      )}

      {attendanceError && (
        <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/[0.07] px-4 py-3 text-sm font-medium text-red-400">
          {attendanceError}
        </div>
      )}

      {/* =====================================
          QUICK ACTIONS
      ===================================== */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* CHECK IN */}

        <div className="rounded-2xl border border-blue-500/20 bg-[#08204a] p-5 shadow-[0_10px_35px_rgba(0,0,0,0.15)]">

          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
            <FiClock size={21} />
          </div>

          <h3 className="text-base font-semibold text-white">
            Check In / Out
          </h3>

          <p className="mt-1 text-sm text-[#7891a8]">
            Mark your attendance
          </p>

          {!todayAttendance ? (
            <button
              type="button"
              disabled={attendanceActionLoading}
              onClick={() => handleAttendance("check-in")}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiLogIn size={16} />

              {attendanceActionLoading
                ? "Processing..."
                : "Check In"}
            </button>
          ) : !todayAttendance.checkOut ? (
            <button
              type="button"
              disabled={attendanceActionLoading}
              onClick={() => handleAttendance("check-out")}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiLogOut size={16} />

              {attendanceActionLoading
                ? "Processing..."
                : "Check Out"}
            </button>
          ) : (
            <div className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500/10 py-3 text-sm font-semibold text-emerald-400">
              <FiCheckCircle size={16} />
              Completed
            </div>
          )}
        </div>

        {/* DOCUMENTS */}

        <div className="rounded-2xl border border-blue-500/20 bg-[#08204a] p-5 shadow-[0_10px_35px_rgba(0,0,0,0.15)]">

          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
            <FiUpload size={21} />
          </div>

          <h3 className="text-base font-semibold text-white">
            Upload Documents
          </h3>

          <p className="mt-1 text-sm text-[#7891a8]">
            ID, certificates, etc.
          </p>

          <button
            type="button"
            onClick={() => router.push("/employee/documents")}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Upload
            <FiUpload size={16} />
          </button>
        </div>

        {/* LEAVE */}

        <div className="rounded-2xl border border-blue-500/20 bg-[#08204a] p-5 shadow-[0_10px_35px_rgba(0,0,0,0.15)]">

          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
            <FiCalendar size={21} />
          </div>

          <h3 className="text-base font-semibold text-white">
            Request Leave
          </h3>

          <p className="mt-1 text-sm text-[#7891a8]">
            Apply for leave
          </p>

          <button
            type="button"
            onClick={() => router.push("/employee/leave")}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Apply
            <FiCalendar size={16} />
          </button>
        </div>

        {/* PROFILE */}

        <div className="rounded-2xl border border-blue-500/20 bg-[#08204a] p-5 shadow-[0_10px_35px_rgba(0,0,0,0.15)]">

          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
            <FiUser size={21} />
          </div>

          <h3 className="text-base font-semibold text-white">
            Update Profile
          </h3>

          <p className="mt-1 text-sm text-[#7891a8]">
            Keep your information updated
          </p>

          <button
            type="button"
            onClick={() => router.push("/employee/profile")}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            View Profile
            <FiUser size={16} />
          </button>
        </div>
      </div>

      {/* =====================================
          LOWER SECTION
      ===================================== */}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">

        {/* ATTENDANCE */}

        <div className="rounded-2xl border border-blue-500/20 bg-[#08204a] p-6">

          <div className="mb-6 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <FiClock
                size={21}
                className="text-blue-400"
              />

              <h2 className="text-lg font-semibold text-white">
                Today&apos;s Attendance
              </h2>

            </div>

            <button
              type="button"
              onClick={() =>
                router.push("/employee/attendance")
              }
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              View History
            </button>

          </div>

          <div className="grid gap-6 sm:grid-cols-2">

            {/* STATUS */}

            <div className="flex items-center gap-5">

              <div className="flex h-28 w-28 items-center justify-center rounded-full border-[8px] border-blue-500/20">

                {todayAttendance?.checkOut ? (
                  <FiCheckCircle
                    size={35}
                    className="text-emerald-400"
                  />
                ) : (
                  <FiClock
                    size={35}
                    className="text-blue-400"
                  />
                )}

              </div>

              <div>

                <p className="text-sm text-[#7891a8]">
                  Status
                </p>

                <h3 className="mt-1 text-xl font-semibold text-white">
                  {attendanceLoading
                    ? "Loading..."
                    : attendanceStatus}
                </h3>

                <p className="mt-2 text-sm text-[#7891a8]">
                  {todayAttendance?.checkIn
                    ? `Checked in at ${formatTime(
                        todayAttendance.checkIn
                      )}`
                    : "Today"}
                </p>

              </div>

            </div>

            {/* WORK HOURS */}

            <div className="flex items-center gap-4 border-t border-blue-500/10 pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <FiClock size={20} />
              </div>

              <div>

                <p className="text-sm text-[#7891a8]">
                  Total Work Hours
                </p>

                <p className="mt-1 text-xl font-semibold text-white">
                  {formatWorkedTime(
                    todayAttendance?.workedMinutes
                  )}
                </p>

                {todayAttendance?.checkIn && (
                  <p className="mt-1 text-xs text-[#60788c]">
                    {todayAttendance.checkOut
                      ? `Out at ${formatTime(
                          todayAttendance.checkOut
                        )}`
                      : "Currently working"}
                  </p>
                )}

              </div>

            </div>

          </div>
        </div>

        {/* ANNOUNCEMENTS */}

        <div className="rounded-2xl border border-blue-500/20 bg-[#08204a] p-6">

          <div className="mb-5 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <FiBell
                size={21}
                className="text-purple-400"
              />

              <h2 className="text-lg font-semibold text-white">
                Latest Announcements
              </h2>

            </div>

            <button
              type="button"
              onClick={() =>
                router.push("/employee/announcements")
              }
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              View All
            </button>

          </div>

          <div className="space-y-4">

            <div className="flex items-center gap-3 border-b border-blue-500/10 pb-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
                <FiCalendar size={18} />
              </div>

              <div className="min-w-0">

                <p className="text-sm font-medium text-white">
                  Holiday Notice
                </p>

                <p className="mt-1 truncate text-xs text-[#7891a8]">
                  Office holiday information will appear here.
                </p>

              </div>

            </div>

            <div className="flex items-center gap-3 border-b border-blue-500/10 pb-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                <FiFileText size={18} />
              </div>

              <div className="min-w-0">

                <p className="text-sm font-medium text-white">
                  HR Policy Update
                </p>

                <p className="mt-1 truncate text-xs text-[#7891a8]">
                  New company policies will appear here.
                </p>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
                <FiUser size={18} />
              </div>

              <div className="min-w-0">

                <p className="text-sm font-medium text-white">
                  Welcome to the Team
                </p>

                <p className="mt-1 truncate text-xs text-[#7891a8]">
                  Welcome to your HR Vortex employee portal.
                </p>

              </div>

            </div>

          </div>
        </div>
      </div>

      {/* =====================================
          QUICK LINKS + PROFILE
      ===================================== */}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">

        {/* QUICK LINKS */}

        <div className="rounded-2xl border border-blue-500/20 bg-[#08204a] p-6">

          <div className="mb-5 flex items-center gap-3">

            <FiFileText
              size={21}
              className="text-blue-400"
            />

            <h2 className="text-lg font-semibold text-white">
              Quick Links
            </h2>

          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

            <button
              type="button"
              onClick={() =>
                router.push("/employee/payslips")
              }
              className="rounded-xl border border-blue-500/15 bg-[#061a39] p-4 transition hover:border-blue-500/40 hover:bg-blue-500/5"
            >

              <FiCreditCard
                size={22}
                className="mx-auto text-blue-400"
              />

              <p className="mt-3 text-xs font-medium text-white">
                Payslips
              </p>

            </button>

            <button
              type="button"
              onClick={() =>
                router.push("/employee/leave")
              }
              className="rounded-xl border border-blue-500/15 bg-[#061a39] p-4 transition hover:border-blue-500/40 hover:bg-blue-500/5"
            >

              <FiCalendar
                size={22}
                className="mx-auto text-purple-400"
              />

              <p className="mt-3 text-xs font-medium text-white">
                Leave Balance
              </p>

            </button>

            <button
              type="button"
              onClick={() =>
                router.push("/employee/documents")
              }
              className="rounded-xl border border-blue-500/15 bg-[#061a39] p-4 transition hover:border-blue-500/40 hover:bg-blue-500/5"
            >

              <FiFileText
                size={22}
                className="mx-auto text-blue-400"
              />

              <p className="mt-3 text-xs font-medium text-white">
                Documents
              </p>

            </button>

            <button
              type="button"
              onClick={() =>
                router.push("/employee/support")
              }
              className="rounded-xl border border-blue-500/15 bg-[#061a39] p-4 transition hover:border-blue-500/40 hover:bg-blue-500/5"
            >

              <FiHeadphones
                size={22}
                className="mx-auto text-purple-400"
              />

              <p className="mt-3 text-xs font-medium text-white">
                Help & Support
              </p>

            </button>

          </div>
        </div>

        {/* PROFILE */}

        <div className="rounded-2xl border border-blue-500/20 bg-[#08204a] p-6">

          <div className="mb-5 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <FiUser
                size={21}
                className="text-blue-400"
              />

              <h2 className="text-lg font-semibold text-white">
                Your Profile
              </h2>

            </div>

            <button
              type="button"
              onClick={() =>
                router.push("/employee/profile")
              }
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Edit
            </button>

          </div>

          <div className="flex items-center gap-5">

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-2xl font-bold text-white">
              {user.fullName?.charAt(0)?.toUpperCase()}
            </div>

            <div className="space-y-1">

              <h3 className="font-semibold text-white">
                {user.fullName}
              </h3>

              <p className="text-sm text-[#7891a8]">
                Employee
              </p>

              <p className="text-xs text-[#7891a8]">
                {user.email}
              </p>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

