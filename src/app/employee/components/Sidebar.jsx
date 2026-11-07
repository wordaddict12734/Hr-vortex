"use client";

import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FiHome,
  FiUser,
  FiClock,
  FiCalendar,
  FiFileText,
  FiCreditCard,
  FiBell,
  FiHeadphones,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

export default function Sidebar({ collapsed, setCollapsed }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      icon: FiHome,
      path: "/employee",
    },
    {
      name: "My Profile",
      icon: FiUser,
      path: "/employee/profile",
    },
    {
      name: "Attendance",
      icon: FiClock,
      path: "/employee/attendance",
    },
    {
      name: "Leave Requests",
      icon: FiCalendar,
      path: "/employee/leave",
    },
    {
      name: "Documents",
      icon: FiFileText,
      path: "/employee/documents",
    },
    {
      name: "Payslips",
      icon: FiCreditCard,
      path: "/employee/payslips",
    },
    {
      name: "Announcements",
      icon: FiBell,
      path: "/employee/announcements",
    },
    {
      name: "Support",
      icon: FiHeadphones,
      path: "/employee/support",
    },
    {
      name: "Settings",
      icon: FiSettings,
      path: "/employee/settings",
    },
  ];

  const handleConfirmLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    router.push("/");
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 z-40 h-screen border-r border-blue-200/10 bg-[#071421] transition-all duration-300 ${
          collapsed ? "w-[82px]" : "w-[260px]"
        }`}
      >
        {/* =====================================
            LOGO / COLLAPSE BUTTON
        ===================================== */}

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`flex h-[90px] w-full items-center border-b border-blue-200/10 transition hover:bg-white/[0.03] ${
            collapsed
              ? "justify-center"
              : "justify-start gap-3 px-5"
          }`}
        >
          <Image
            src="/images/logo.png"
            alt="HR Vortex"
            width={46}
            height={46}
            className="shrink-0 object-contain"
          />

          {!collapsed && (
            <div className="text-left">
              <h1 className="text-[17px] font-bold tracking-[1px] text-white">
                HR VORTEX
              </h1>

              <p className="text-[9px] tracking-[2px] text-[#7891a8]">
                EMPLOYEE
              </p>
            </div>
          )}
        </button>

        {/* =====================================
            NAVIGATION
        ===================================== */}

        <nav className="px-3 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.path === "/employee"
                ? pathname === "/employee"
                : pathname.startsWith(item.path);

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => router.push(item.path)}
                title={collapsed ? item.name : ""}
                className={`group mb-2 flex w-full items-center rounded-xl transition-all duration-200 ${
                  collapsed
                    ? "justify-center py-3"
                    : "gap-4 px-4 py-3"
                } ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-[0_8px_20px_rgba(37,99,235,0.22)]"
                    : "text-[#8fa5b8] hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <Icon size={20} className="shrink-0" />

                {!collapsed && (
                  <span className="text-sm font-medium">
                    {item.name}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* =====================================
            LOGOUT
        ===================================== */}

        <div className="absolute bottom-5 left-0 w-full px-3">
            <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                title={collapsed ? "Logout" : ""}
                className={`flex w-full items-center rounded-xl text-[#8fa5b8] transition hover:bg-red-500/10 hover:text-red-400 ${
                collapsed
                    ? "justify-center py-3"
                    : "gap-4 px-4 py-3"
                }`}
            >
                <FiLogOut size={20} />

                {!collapsed && (
                <span className="text-sm font-medium">
                    Logout
                </span>
                )}
            </button>
        </div>
      </aside>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">

            <div className="w-full max-w-[400px] rounded-2xl border border-blue-100/20 bg-[#0a1f33] p-7 shadow-2xl">

            {/* ICON */}
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                <FiLogOut size={24} />
            </div>

            {/* TITLE */}
            <h2 className="text-center text-xl font-semibold text-white">
                Logout from HR Vortex?
            </h2>

            {/* MESSAGE */}
            <p className="mt-3 text-center text-sm leading-6 text-[#8fa5b8]">
                You are about to log out from your employee account.
                Are you sure you want to continue?
            </p>

            {/* BUTTONS */}
            <div className="mt-7 flex gap-3">

                {/* CANCEL */}
                <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-xl border border-blue-200/15 bg-white/[0.03] py-3 text-sm font-medium text-[#9db1c2] transition hover:bg-white/[0.07] hover:text-white"
                >
                Cancel
                </button>

                {/* LOGOUT */}
                <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                Logout
                </button>

            </div>

            </div>
        </div>
        )}
    </>
  );
}