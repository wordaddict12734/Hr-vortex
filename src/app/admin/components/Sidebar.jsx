"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import {
  FiHome,
  FiUsers,
  FiClipboard,
  FiLogOut,
  FiX,
  FiAlertTriangle,
} from "react-icons/fi";

export default function Sidebar({ collapsed, setCollapsed }){
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  // Navigation items
  const menuItems = [
    {
      name: "Dashboard",
      icon: FiHome,
      path: "/admin",
    },
    {
      name: "Employees",
      icon: FiUsers,
      path: "/admin/employees",
    },

    {
      name: "Requests",
      icon: FiClipboard,
      path: "/admin/requests",
    },
  ];

  // Open logout confirmation
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // Confirm logout
  const handleConfirmLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    setShowLogoutModal(false);

    router.push("/");
  };

  // Cancel logout
  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      {/*SIDEBAR*/}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen flex-col
          overflow-hidden
          border-r border-blue-300/10
          bg-[#06172d]
          transition-[width] duration-300 ease-in-out
          ${collapsed ? "w-[82px]" : "w-[280px]"}
        `}
      >
        {/*  LOGO / COLLAPSE BUTTON*/}
        <div
          className={`
            flex h-[84px] shrink-0
            items-center
            overflow-hidden
            border-b border-blue-300/10
            ${
              collapsed
                ? "justify-center"
                : "justify-start px-6"
            }
          `}
        >
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`
              flex shrink-0 items-center
              transition-all duration-300
              ${
                collapsed
                  ? "justify-center"
                  : "gap-3"
              }
            `}
          >
            {/* Logo */}
            <Image
              src="/images/logo.png"
              alt="HR Vortex Logo"
              width={52}
              height={52}
              priority
              className={`
                shrink-0
                object-contain
                transition-all duration-300
                ${
                  collapsed
                    ? "h-11 w-11"
                    : "h-12 w-12"
                }
              `}
            />

            {/* Brand name */}
            {!collapsed && (
              <div className="w-[150px] shrink-0 overflow-hidden whitespace-nowrap">
                <h1 className="text-[22px] font-bold tracking-[1px] text-white">
                  HR VORTEX
                </h1>

                <p className="mt-0.5 text-[8px] tracking-[2px] text-[#8da9c2]">
                  SMARTER HR. STRONGER TEAMS.
                </p>
              </div>
            )}
          </button>
        </div>


        {/*  NAVIGATION*/}
        <nav
          className="
            flex-1
            overflow-x-hidden
            overflow-y-auto
            px-4
            py-7
          "
        >
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.path ||
                (item.path !== "/admin" &&
                  pathname.startsWith(item.path));

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => router.push(item.path)}
                  title={collapsed ? item.name : undefined}
                  className={`
                    group relative
                    flex h-[52px] w-full shrink-0
                    items-center
                    rounded-xl
                    transition-all duration-300

                    ${
                      collapsed
                        ? "justify-center px-0"
                        : "justify-start px-5"
                    }

                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-[0_8px_25px_rgba(37,99,235,0.25)]"
                        : "text-[#9aafc1] hover:bg-blue-500/[0.08] hover:text-white"
                    }
                  `}
                >
                  {/* ICON */}
                  <Icon
                    size={22}
                    className={`
                      shrink-0
                      transition-all duration-200
                      ${
                        isActive
                          ? "text-white"
                          : "text-[#9ab7d1] group-hover:scale-105 group-hover:text-white"
                      }
                    `}
                  />

                  {/* TEXT */}
                  {!collapsed && (
                    <span
                      className="
                        ml-4
                        whitespace-nowrap
                        text-[15px]
                        font-medium
                      "
                    >
                      {item.name}
                    </span>
                  )}

                  {/*TOOLTIP
                      Only appears when sidebar is collapsed*/}
                  {collapsed && (
                    <span
                      className="
                        pointer-events-none
                        absolute left-[68px]
                        z-[60]
                        whitespace-nowrap
                        rounded-lg
                        border border-blue-300/10
                        bg-[#0b2239]
                        px-3 py-2
                        text-xs text-white
                        opacity-0
                        shadow-xl
                        transition-opacity
                        duration-200
                        group-hover:opacity-100
                      "
                    >
                      {item.name}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>


        {/*  LOGOUT*/}
        <div
          className="
            shrink-0
            overflow-hidden
            border-t border-blue-300/10
            p-4
          "
        >
          <button
            type="button"
            onClick={handleLogoutClick}
            title={collapsed ? "Logout" : undefined}
            className={`
              group relative
              flex h-[52px] w-full
              items-center
              rounded-xl
              text-[#9aafc1]
              transition-all duration-200
              hover:bg-red-500/[0.08]
              hover:text-red-400

              ${
                collapsed
                  ? "justify-center px-0"
                  : "justify-start gap-3 px-5"
              }
            `}
          >

            {/* Logout text */}
            {!collapsed && (
              <span
                className="
                  whitespace-nowrap
                  text-[15px]
                  font-medium
                "
              >
                Logout
              </span>
            )}

            {/* Logout Icon */}
            <FiLogOut
              size={21}
              className="
                shrink-0
                transition-transform
                duration-200
                group-hover:scale-105
              "
            />

            {/* Tooltip when collapsed */}
            {collapsed && (
              <span
                className="
                  pointer-events-none
                  absolute left-[68px]
                  z-[60]
                  whitespace-nowrap
                  rounded-lg
                  border border-blue-300/10
                  bg-[#0b2239]
                  px-3 py-2
                  text-xs text-white
                  opacity-0
                  shadow-xl
                  transition-opacity
                  duration-200
                  group-hover:opacity-100
                "
              >
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>


      {/*LOGOUT CONFIRMATION MODAL*/}
      {showLogoutModal && (
        <div
          className="
            fixed inset-0 z-[100]
            flex items-center justify-center
            bg-black/60
            px-4
            backdrop-blur-sm
          "
        >
          <div
            className="
              w-full max-w-md
              rounded-2xl
              border border-blue-200/10
              bg-[#0b1d31]
              p-7
              shadow-[0_25px_70px_rgba(0,0,0,0.55)]
            "
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">

                {/* Warning Icon */}
                <div
                  className="
                    flex h-12 w-12
                    shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-red-500/10
                    text-red-400
                  "
                >
                  <FiAlertTriangle size={23} />
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Confirm Logout
                  </h2>

                  <p className="mt-1 text-sm text-[#8299ad]">
                    End your current session?
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleCancelLogout}
                className="
                  flex h-8 w-8
                  shrink-0
                  items-center justify-center
                  rounded-lg
                  text-[#7f98ad]
                  transition
                  hover:bg-white/5
                  hover:text-white
                "
                aria-label="Close"
              >
                <FiX size={19} />
              </button>
            </div>


            {/* Modal Message */}
            <p className="mt-6 text-sm leading-6 text-[#9aafc1]">
              Are you sure you want to log out of HR Vortex?
              You will need to sign in again to access your
              account.
            </p>


            {/* Modal Buttons */}
            <div className="mt-7 flex justify-end gap-3">

              {/* Cancel */}
              <button
                type="button"
                onClick={handleCancelLogout}
                className="
                  rounded-xl
                  border border-blue-200/15
                  bg-white/[0.03]
                  px-5 py-2.5
                  text-sm font-medium
                  text-[#a7b9c8]
                  transition
                  hover:bg-white/[0.06]
                  hover:text-white
                "
              >
                Cancel
              </button>


              {/* Logout */}
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="
                  flex items-center gap-2
                  rounded-xl
                  bg-red-500
                  px-5 py-2.5
                  text-sm font-medium
                  text-white
                  shadow-lg
                  shadow-red-500/20
                  transition
                  hover:bg-red-600
                "
              >
                Logout
                <FiLogOut size={17} />
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}