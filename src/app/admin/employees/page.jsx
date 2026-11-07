"use client";

import { useEffect, useState } from "react";

import {
  FiUsers,
  FiSearch,
  FiMail,
  FiPhone,
  FiUser,
  FiCheckCircle,
  FiRefreshCw,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const employeesPerPage = 5;

  // =====================================
  // FETCH EMPLOYEES
  // =====================================

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/employees");

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to fetch employees.");
        return;
      }

      setEmployees(data.employees || []);
    } catch (error) {
      console.error("Fetch employees error:", error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // =====================================
  // SEARCH
  // =====================================

  const filteredEmployees = employees.filter((employee) => {
    const searchText = search.toLowerCase().trim();

    return (
      employee.fullName?.toLowerCase().includes(searchText) ||
      employee.email?.toLowerCase().includes(searchText) ||
      employee.phone?.toLowerCase().includes(searchText)
    );
  });

  // =====================================
  // RESET PAGE WHEN SEARCH CHANGES
  // =====================================

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // =====================================
  // PAGINATION
  // =====================================

  const totalPages = Math.ceil(
    filteredEmployees.length / employeesPerPage
  );

  const startIndex =
    (currentPage - 1) * employeesPerPage;

  const endIndex =
    startIndex + employeesPerPage;

  const currentEmployees =
    filteredEmployees.slice(startIndex, endIndex);

  // =====================================
  // EXPORT EXCEL
  // =====================================

  const handleExportExcel = async () => {
    try {
      const XLSX = await import("xlsx");

      const exportData = filteredEmployees.map(
        (employee, index) => ({
          "S.No": index + 1,
          "Full Name": employee.fullName,
          Email: employee.email,
          Phone: employee.phone,
          Role: employee.role,
          Status: employee.status,
          "Joined On": employee.createdAt
            ? new Date(employee.createdAt).toLocaleDateString(
                "en-IN"
              )
            : "",
        })
      );

      const worksheet =
        XLSX.utils.json_to_sheet(exportData);

      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Employees"
      );

      XLSX.writeFile(
        workbook,
        "HR_Vortex_Employees.xlsx"
      );
    } catch (error) {
      console.error("Excel export error:", error);
      setError("Unable to export employees to Excel.");
    }
  };

  // =====================================
  // PAGE CHANGE
  // =====================================

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-[#071421] px-6 py-8 lg:px-10">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-300/15 bg-blue-500/10 text-blue-400">
              <FiUsers size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-white">
                Employees
              </h1>

              <p className="mt-1 text-sm text-[#8198ad]">
                Manage your active employees
              </p>
            </div>

          </div>
        </div>


        {/* Header Buttons */}

        <div className="flex items-center gap-3">

          {/* Export */}

          <button
            type="button"
            onClick={handleExportExcel}
            disabled={
              loading || filteredEmployees.length === 0
            }
            className="
              flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-blue-200/10
              bg-[#0b1d31]
              px-4
              text-sm
              font-medium
              text-[#a8bbcb]
              transition
              hover:border-blue-400/20
              hover:bg-blue-500/[0.08]
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <FiDownload size={17} />

            Export Excel
          </button>


          {/* Refresh */}

          <button
            type="button"
            onClick={fetchEmployees}
            disabled={loading}
            className="
              flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-blue-200/10
              bg-[#0b1d31]
              px-4
              text-sm
              font-medium
              text-[#a8bbcb]
              transition
              hover:border-blue-400/20
              hover:bg-blue-500/[0.08]
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <FiRefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />

            Refresh
          </button>

        </div>

      </div>


      {/* =====================================
          STAT CARD
      ===================================== */}

      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-2xl border border-blue-200/10 bg-[#0a1c30] p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs uppercase tracking-[1px] text-[#718ba3]">
                Active Employees
              </p>

              <h2 className="mt-2 text-3xl font-semibold text-white">
                {employees.length}
              </h2>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <FiUsers size={21} />
            </div>

          </div>

        </div>

      </div>


      {/* =====================================
          SEARCH
      ===================================== */}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div
          className="
            flex
            h-[54px]
            w-full
            max-w-md
            items-center
            rounded-xl
            border
            border-blue-200/10
            bg-[#0a1c30]
            transition
            focus-within:border-blue-400/40
            focus-within:ring-4
            focus-within:ring-blue-400/5
          "
        >

          <FiSearch
            size={19}
            className="ml-5 shrink-0 text-[#718ba3]"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employees..."
            className="
              h-full
              flex-1
              bg-transparent
              px-4
              text-sm
              text-white
              outline-none
              placeholder:text-[#718ba3]
            "
          />

        </div>

      </div>


      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-400/15 bg-red-500/10 px-5 py-4 text-sm text-red-300">
          {error}
        </div>
      )}


      {/* =====================================
          EMPLOYEE TABLE
      ===================================== */}

      <div className="overflow-hidden rounded-2xl border border-blue-200/10 bg-[#0a1c30]">

        {/* Table Header */}

        <div className="border-b border-blue-200/10 px-6 py-5">

          <h2 className="text-base font-semibold text-white">
            Employee Directory
          </h2>

          <p className="mt-1 text-xs text-[#718ba3]">

            {filteredEmployees.length === 0
              ? "No employees found"
              : `Showing ${startIndex + 1}–${Math.min(
                  endIndex,
                  filteredEmployees.length
                )} of ${filteredEmployees.length} employees`}

          </p>

        </div>


        {/* =====================================
            LOADING
        ===================================== */}

        {loading ? (

          <div className="flex min-h-[300px] items-center justify-center">

            <div className="flex items-center gap-3 text-sm text-[#8198ad]">

              <FiRefreshCw
                size={18}
                className="animate-spin"
              />

              Loading employees...

            </div>

          </div>

        ) : currentEmployees.length === 0 ? (

          /* =====================================
             EMPTY
          ===================================== */

          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
              <FiUsers size={25} />
            </div>

            <h3 className="text-base font-medium text-white">
              {search
                ? "No employees found"
                : "No active employees yet"}
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[#718ba3]">
              {search
                ? "Try searching with a different name, email or phone number."
                : "Approved employee accounts will appear here."}
            </p>

          </div>

        ) : (

          /* =====================================
             EMPLOYEE ROWS
          ===================================== */

          <div className="divide-y divide-blue-200/10">

            {currentEmployees.map((employee) => (

              <div
                key={employee._id}
                className="
                  px-6
                  py-5
                  transition
                  hover:bg-blue-500/[0.03]
                "
              >

                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                  {/* Employee Identity */}

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-blue-300/10 bg-blue-500/10 text-blue-400">
                      <FiUser size={20} />
                    </div>

                    <div>

                      <h3 className="text-sm font-semibold text-white">
                        {employee.fullName}
                      </h3>

                      <p className="mt-1 text-xs text-[#718ba3]">
                        Employee
                      </p>

                    </div>

                  </div>


                  {/* Employee Details */}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">

                    {/* Email */}

                    <div className="flex items-center gap-2.5">

                      <FiMail
                        size={16}
                        className="shrink-0 text-[#718ba3]"
                      />

                      <span className="text-sm text-[#a8bbcb]">
                        {employee.email}
                      </span>

                    </div>


                    {/* Phone */}

                    <div className="flex items-center gap-2.5">

                      <FiPhone
                        size={16}
                        className="shrink-0 text-[#718ba3]"
                      />

                      <span className="text-sm text-[#a8bbcb]">
                        {employee.phone}
                      </span>

                    </div>


                    {/* Status */}

                    <div className="flex items-center gap-2 rounded-full border border-green-400/10 bg-green-500/[0.08] px-3 py-1.5">

                      <FiCheckCircle
                        size={14}
                        className="text-green-400"
                      />

                      <span className="text-xs font-medium text-green-300">
                        Active
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}


        {/* =====================================
            PAGINATION
        ===================================== */}

        {!loading &&
          filteredEmployees.length > 0 &&
          totalPages > 1 && (

            <div className="flex flex-col gap-4 border-t border-blue-200/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

              {/* Page Information */}

              <p className="text-xs text-[#718ba3]">
                Page {currentPage} of {totalPages}
              </p>


              {/* Pagination Controls */}

              <div className="flex items-center gap-2">

                {/* Previous */}

                <button
                  type="button"
                  onClick={() =>
                    goToPage(currentPage - 1)
                  }
                  disabled={currentPage === 1}
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-blue-200/10
                    bg-white/[0.02]
                    text-[#8da9c2]
                    transition
                    hover:bg-blue-500/[0.08]
                    hover:text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >
                  <FiChevronLeft size={17} />
                </button>


                {/* Page Numbers */}

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (

                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    className={`
                      flex
                      h-9
                      min-w-9
                      items-center
                      justify-center
                      rounded-lg
                      px-2
                      text-xs
                      font-medium
                      transition

                      ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                          : "border border-blue-200/10 bg-white/[0.02] text-[#8da9c2] hover:bg-blue-500/[0.08] hover:text-white"
                      }
                    `}
                  >
                    {page}
                  </button>

                ))}


                {/* Next */}

                <button
                  type="button"
                  onClick={() =>
                    goToPage(currentPage + 1)
                  }
                  disabled={
                    currentPage === totalPages
                  }
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-blue-200/10
                    bg-white/[0.02]
                    text-[#8da9c2]
                    transition
                    hover:bg-blue-500/[0.08]
                    hover:text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >
                  <FiChevronRight size={17} />
                </button>

              </div>

            </div>

          )}

      </div>

    </div>
  );
}

