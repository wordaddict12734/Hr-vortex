"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#071421] text-white">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className={`min-h-screen transition-[margin] duration-300 ease-in-out ${
          collapsed ? "ml-[82px]" : "ml-[280px]"
        }`}
      >
        {children}
      </main>
    </div>
  );
}