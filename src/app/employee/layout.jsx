"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiBell, FiSearch, FiUser } from "react-icons/fi";

import Sidebar from "./components/Sidebar";

export default function EmployeeLayout({ children }) {
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);

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

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#06152a] text-white">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#06152a] text-white">
      {/* SIDEBAR */}

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* MAIN AREA */}

      <section
        className={`min-h-screen transition-all duration-300 ${
          collapsed ? "ml-[82px]" : "ml-[260px]"
        }`}
      >
        {/* TOP BAR */}

        <header className="flex h-[90px] items-center justify-between border-b border-blue-200/10 bg-[#06152a]/95 px-6 sm:px-10">
          {/* SEARCH */}

          <div className="flex h-11 w-full max-w-[510px] items-center rounded-xl border border-blue-500/30 bg-[#08204a]/80 px-4">
            <FiSearch
              size={20}
              className="mr-3 text-blue-400"
            />

            <input
              type="text"
              placeholder="Search anything..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#7891a8]"
            />
          </div>

          {/* USER AREA */}

          <div className="ml-5 flex items-center gap-5">
            {/* NOTIFICATION */}

            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#a8bdd0] transition hover:bg-white/5 hover:text-white"
            >
              <FiBell size={21} />

              <span className="absolute right-[8px] top-[7px] h-2 w-2 rounded-full bg-red-400" />
            </button>

            {/* USER */}

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-white">
                  {user.fullName}
                </p>

                <p className="text-xs text-[#7891a8]">
                  Employee
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg">
                <FiUser size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* PAGE */}

        <div className="min-h-[calc(100vh-90px)] px-6 py-8 sm:px-10">
          {children}
        </div>
      </section>
    </main>
  );
}