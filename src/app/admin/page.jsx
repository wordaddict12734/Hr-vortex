"use client";

import { useEffect, useState } from "react";

import {
  FiChevronDown,
  FiArrowUp,
  FiArrowDown,
  FiArrowRight,
  FiUsers,
  FiCalendar,
  FiBriefcase,
  FiFileText,
  FiMoreVertical,
} from "react-icons/fi";

export default function AdminPage() {
  
  // DASHBOARD STATE
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    pendingRequests: 0,
    recentEmployees: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH DASHBOARD DATA
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/admin/dashboard");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load dashboard"
          );
        }

        setDashboardData(data.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);

        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

 
  // STATISTICS
  const stats = [
    {
      title: "Total Employees",
      value: loading ? "—" : dashboardData.totalEmployees,
      change: "",
      text: "active employees",
      icon: FiUsers,
      iconStyle: "bg-blue-600/20 text-blue-400",
      positive: true,
    },

    {
      title: "Present Today",
      value: "—",
      change: "",
      text: "attendance not set up",
      icon: FiCalendar,
      iconStyle: "bg-emerald-500/20 text-emerald-400",
      positive: true,
    },

    {
      title: "On Leave",
      value: "—",
      change: "",
      text: "leave system not set up",
      icon: FiBriefcase,
      iconStyle: "bg-amber-500/20 text-amber-400",
      positive: false,
    },

    {
      title: "Pending Requests",
      value: loading ? "—" : dashboardData.pendingRequests,
      change: "",
      text: "awaiting approval",
      icon: FiFileText,
      iconStyle: "bg-purple-500/20 text-purple-400",
      positive: true,
    },
  ];

  return (
    <>

      {/*  TOP HEADER*/}

        <header className="flex h-[84px] items-center justify-end border-b border-blue-300/10 px-8">


          {/* ADMIN PROFILE */}

          <div className="ml-5 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-semibold">
              A
            </div>

            <div className="hidden sm:block">

              <p className="text-sm font-medium text-white">
                Admin
              </p>

              <p className="text-[11px] text-[#718ba3]">
                Administrator
              </p>

            </div>

            <FiChevronDown
              size={16}
              className="text-[#718ba3]"
            />

          </div>

        </header>


        {/*  DASHBOARD CONTENT*/}

        <section className="px-8 py-7">


          {/* GREETING*/}

          <div className="mb-7">

            <h1 className="text-[30px] font-semibold tracking-tight text-white">
              Good Morning, Admin 👋
            </h1>

            <p className="mt-1 text-sm text-[#819bb2]">
              Here&apos;s what&apos;s happening with your team today.
            </p>

          </div>


          {/*    ERROR MESSAGE*/}

          {error && (
            <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}


          {/*    STAT CARDS*/}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

            {stats.map((stat) => {

              const Icon = stat.icon;

              return (

                <div
                  key={stat.title}
                  className="group relative overflow-hidden rounded-2xl border border-blue-300/10 bg-[#0a2037] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-blue-400/20"
                >

                  {/* Decorative circle */}

                  <div className="pointer-events-none absolute -bottom-14 -right-10 h-32 w-32 rounded-full border border-blue-400/20" />


                  <div className="relative">

                    {/* ICON */}

                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconStyle}`}
                    >
                      <Icon size={22} />
                    </div>


                    {/* TITLE */}

                    <p className="mt-5 text-sm text-[#8da6bb]">
                      {stat.title}
                    </p>


                    {/* NUMBER */}

                    <h2 className="mt-1 text-[30px] font-semibold tracking-tight text-white">
                      {stat.value}
                    </h2>


                    {/* CHANGE / DESCRIPTION */}

                    <div className="mt-2 flex items-center gap-2">

                      {stat.change && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">

                          {stat.positive ? (
                            <FiArrowUp size={13} />
                          ) : (
                            <FiArrowDown size={13} />
                          )}

                          {stat.change}

                        </span>
                      )}

                      <span className="text-[11px] text-[#6f879d]">
                        {stat.text}
                      </span>

                    </div>

                  </div>

                </div>

              );
            })}

          </div>


          {/*    CHARTS ROW*/}

          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.7fr_1fr]">


            {/*      ATTENDANCE OVERVIEW
            ========================== */}

            <div className="rounded-2xl border border-blue-300/10 bg-[#0a2037] p-5">

              <div className="flex items-center justify-between">

                <h2 className="text-[16px] font-semibold text-white">
                  Attendance Overview
                </h2>

                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-blue-300/10 bg-[#0d2842] px-3 py-2 text-xs text-[#91a8bc]"
                >
                  Last 7 Days

                  <FiChevronDown size={14} />

                </button>

              </div>


              {/* CHART */}

              <div className="relative mt-6 h-[235px]">


                {/* GRID */}

                <div className="absolute inset-0 flex flex-col justify-between">

                  {[120, 90, 60, 30, 0].map((number) => (

                    <div
                      key={number}
                      className="flex items-center"
                    >

                      <span className="w-8 text-[10px] text-[#718ba3]">
                        {number}
                      </span>

                      <div className="h-px flex-1 bg-blue-300/[0.07]" />

                    </div>

                  ))}

                </div>


                {/* SVG */}

                <div className="absolute left-10 right-0 top-0 h-[205px]">

                  <svg
                    viewBox="0 0 700 205"
                    preserveAspectRatio="none"
                    className="h-full w-full overflow-visible"
                  >

                    <defs>

                      <linearGradient
                        id="attendanceGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >

                        <stop
                          offset="0%"
                          stopColor="#2563eb"
                          stopOpacity="0.38"
                        />

                        <stop
                          offset="100%"
                          stopColor="#2563eb"
                          stopOpacity="0"
                        />

                      </linearGradient>

                    </defs>


                    {/* AREA */}

                    <path
                      d="
                        M 0 125
                        C 55 125, 70 125, 115 125
                        C 160 125, 170 115, 225 126
                        C 275 138, 295 118, 340 120
                        C 390 120, 410 52, 455 55
                        C 505 42, 525 75, 570 70
                        C 620 68, 650 90, 700 48
                        L 700 205
                        L 0 205
                        Z
                      "
                      fill="url(#attendanceGradient)"
                    />


                    {/* LINE */}

                    <path
                      d="
                        M 0 125
                        C 55 125, 70 125, 115 125
                        C 160 125, 170 115, 225 126
                        C 275 138, 295 118, 340 120
                        C 390 120, 410 52, 455 55
                        C 505 42, 525 75, 570 70
                        C 620 68, 650 90, 700 48
                      "
                      fill="none"
                      stroke="#318cff"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />


                    {/* POINTS */}

                    {[
                      [0, 125],
                      [115, 125],
                      [225, 126],
                      [340, 120],
                      [455, 55],
                      [570, 70],
                      [700, 48],
                    ].map(([x, y], index) => (

                      <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#318cff"
                      />

                    ))}

                  </svg>

                </div>


                {/* X AXIS */}

                <div className="absolute bottom-0 left-10 right-0 flex justify-between">

                  {[
                    "Aug 20",
                    "Aug 21",
                    "Aug 22",
                    "Aug 23",
                    "Aug 24",
                    "Aug 25",
                    "Aug 26",
                  ].map((day) => (

                    <span
                      key={day}
                      className="text-[10px] text-[#718ba3]"
                    >
                      {day}
                    </span>

                  ))}

                </div>

              </div>

            </div>


            {/*      EMPLOYEE DISTRIBUTION
            ========================== */}

            <div className="rounded-2xl border border-blue-300/10 bg-[#0a2037] p-5">

              <h2 className="text-[16px] font-semibold text-white">
                Employee Distribution
              </h2>


              <div className="mt-7 flex items-center justify-center gap-7">


                {/* DONUT */}

                <div className="relative flex h-[165px] w-[165px] items-center justify-center">

                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "conic-gradient(#2563eb 0deg 126deg, #8b5cf6 126deg 198deg, #f59e0b 198deg 252deg, #ec4899 252deg 295deg, #38bdf8 295deg 331deg, #facc15 331deg 360deg)",
                    }}
                  />

                  <div className="absolute inset-[25px] flex flex-col items-center justify-center rounded-full bg-[#0a2037]">

                    <span className="text-2xl font-semibold text-white">
                      {loading ? "—" : dashboardData.totalEmployees}
                    </span>

                    <span className="text-xs text-[#718ba3]">
                      Total
                    </span>

                  </div>

                </div>


                {/* LEGEND */}

                <div className="space-y-3">

                  {[
                    ["IT", "35%", "bg-blue-500"],
                    ["HR", "20%", "bg-purple-500"],
                    ["Finance", "15%", "bg-amber-500"],
                    ["Marketing", "12%", "bg-pink-500"],
                    ["Sales", "10%", "bg-sky-400"],
                    ["Others", "8%", "bg-yellow-400"],
                  ].map(([name, percentage, color]) => (

                    <div
                      key={name}
                      className="flex items-center gap-2"
                    >

                      <span
                        className={`h-2.5 w-2.5 rounded-full ${color}`}
                      />

                      <span className="w-[65px] text-xs text-[#91a8bc]">
                        {name}
                      </span>

                      <span className="text-xs text-white">
                        {percentage}
                      </span>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>


          {/*    RECENT EMPLOYEES*/}

          <div className="mt-5 overflow-hidden rounded-2xl border border-blue-300/10 bg-[#0a2037]">


            {/* TABLE HEADER */}

            <div className="flex items-center justify-between border-b border-blue-300/10 px-5 py-4">

              <h2 className="text-[16px] font-semibold text-white">
                Recent Employees
              </h2>

              <button
                type="button"
                className="flex items-center gap-1 text-xs font-medium text-blue-400 transition hover:text-blue-300"
              >
                View All

                <FiArrowRight size={14} />

              </button>

            </div>


            {/* TABLE */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[750px]">


                {/* HEADER */}

                <thead>

                  <tr className="border-b border-blue-300/10">

                    <th className="px-5 py-3 text-left text-[11px] font-medium text-[#718ba3]">
                      Name
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-medium text-[#718ba3]">
                      Email
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-medium text-[#718ba3]">
                      Department
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-medium text-[#718ba3]">
                      Designation
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-medium text-[#718ba3]">
                      Status
                    </th>

                    <th className="w-10 px-3 py-3" />

                  </tr>

                </thead>


                {/* BODY */}

                <tbody>

                  {loading ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="px-5 py-10 text-center text-sm text-[#718ba3]"
                      >
                        Loading employees...

                      </td>

                    </tr>

                  ) : dashboardData.recentEmployees.length === 0 ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="px-5 py-10 text-center text-sm text-[#718ba3]"
                      >
                        No active employees found.

                      </td>

                    </tr>

                  ) : (

                    dashboardData.recentEmployees.map((employee) => (

                      <tr
                        key={employee.id}
                        className="border-b border-blue-300/[0.07] transition hover:bg-blue-400/[0.03]"
                      >


                        {/* NAME */}

                        <td className="px-5 py-3.5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400/40 to-blue-700/50 text-[10px] font-semibold text-blue-100">

                              {employee.fullName
                                ?.split(" ")
                                .map((name) => name[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}

                            </div>

                            <span className="text-xs font-medium text-white">
                              {employee.fullName}
                            </span>

                          </div>

                        </td>


                        {/* EMAIL */}

                        <td className="px-5 py-3.5 text-xs text-[#8da6bb]">
                          {employee.email}
                        </td>


                        {/* DEPARTMENT */}

                        <td className="px-5 py-3.5 text-xs text-[#718ba3]">
                          —
                        </td>


                        {/* DESIGNATION */}

                        <td className="px-5 py-3.5 text-xs text-[#718ba3]">
                          —
                        </td>


                        {/* STATUS */}

                        <td className="px-5 py-3.5">

                          <span className="inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-medium text-emerald-400">
                            {employee.status}
                          </span>

                        </td>


                        {/* MORE */}

                        <td className="px-3 py-3.5">

                          <button
                            type="button"
                            className="text-[#718ba3] transition hover:text-white"
                          >
                            <FiMoreVertical size={17} />
                          </button>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </section>
      </>
  );
}