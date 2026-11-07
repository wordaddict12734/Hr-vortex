"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  FiShield,
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
} from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error when user starts typing again
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      console.log("Login successful:", data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      // Redirect based on actual role returned by MongoDB
      if (data.user.role === "admin") {
        router.push("/admin");
      } else if (data.user.role === "employee") {
          if (data.user.mustChangePassword) {
            router.push("/employee/change-password");
          } else {
            router.push("/employee");
          }
      } else {
        setError("Invalid user role.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Unable to connect to the server. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#071421] flex items-center justify-center px-4 py-8 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute -top-72 -left-48 w-[650px] h-[650px] rounded-full border border-blue-300/10" />

      <div className="absolute -bottom-80 -right-48 w-[700px] h-[700px] rounded-full border border-blue-300/10" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-[1020px] min-h-[620px] grid md:grid-cols-2 overflow-hidden rounded-[24px] border border-blue-200/25 bg-[#0a1f33]/80 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">

        {/* =====================================
            LEFT SIDE
        ===================================== */}
        <section className="hidden md:flex flex-col justify-between border-r border-blue-200/15 bg-[#071c2f]/60 px-14 py-14">

          {/* Brand */}
          <div className="flex flex-col items-center text-center mt-10">

            <Image
              src="/images/logo.png"
              alt="HR Vortex Logo"
              width={200}
              height={200}
              className="w-32 h-32 object-contain mb-6 drop-shadow-[0_8px_20px_rgba(0,0,0,0.4)]"
            />

            <h1 className="text-[42px] font-bold tracking-[2px] text-white">
              HR VORTEX
            </h1>

            <p className="mt-3 text-[15px] tracking-[4px] text-[#9db5cb]">
              Smarter HR. Stronger Teams.
            </p>

          </div>

          {/* Bottom text */}
          <div className="text-center">

            <div className="w-20 h-[2px] mx-auto mb-6 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(49,148,255,0.5)]" />

            <p className="text-[13px] tracking-[1px] text-[#91a8bc]">
              Manage People
              <span className="mx-2 text-[#52738e]">•</span>
              Build Progress
              <span className="mx-2 text-[#52738e]">•</span>
              Grow Together
            </p>

          </div>

        </section>

        {/* =====================================
            RIGHT SIDE
        ===================================== */}
        <section className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-[70px]">

          {/* Heading */}
          <div className="mb-7">

            <h2 className="text-4xl font-semibold text-white">
              Welcome Back
            </h2>

            <p className="mt-2 text-base text-[#91a8bc]">
              Please login to your account
            </p>

          </div>

          {/* =====================================
              ROLE SELECTOR
          ===================================== */}
          <div className="mb-7 grid grid-cols-2 rounded-full border border-blue-200/20 bg-white/[0.02] p-[3px]">

            {/* Admin */}
            <button
              type="button"
              onClick={() => {
                setRole("admin");
                setError("");
              }}
              className={`flex items-center justify-center gap-2 rounded-full py-3 text-sm transition-all duration-200 ${
                role === "admin"
                  ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-[0_5px_18px_rgba(28,111,232,0.35)]"
                  : "text-[#91a8bc] hover:text-white"
              }`}
            >
              <FiShield size={19} />
              <span>Admin</span>
            </button>

            {/* Employee */}
            <button
              type="button"
              onClick={() => {
                setRole("employee");
                setError("");
              }}
              className={`flex items-center justify-center gap-2 rounded-full py-3 text-sm transition-all duration-200 ${
                role === "employee"
                  ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-[0_5px_18px_rgba(28,111,232,0.35)]"
                  : "text-[#91a8bc] hover:text-white"
              }`}
            >
              <FiUser size={19} />
              <span>Employee</span>
            </button>

          </div>

          {/* =====================================
              ERROR MESSAGE
          ===================================== */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
              {error}
            </div>
          )}

          {/* =====================================
              FORM
          ===================================== */}
          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="mb-5 flex h-[66px] items-center rounded-full border border-blue-200/30 bg-[#041422]/35 transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-400/10">

              <FiMail
                size={21}
                className="ml-6 shrink-0 text-[#9ab7d1]"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                disabled={loading}
                className="h-full flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-[#718ba3] disabled:cursor-not-allowed disabled:opacity-60"
              />

            </div>

            {/* PASSWORD */}
            <div className="mb-6 flex h-[66px] items-center rounded-full border border-blue-200/30 bg-[#041422]/35 transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-400/10">

              <FiLock
                size={21}
                className="ml-6 shrink-0 text-[#9ab7d1]"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                disabled={loading}
                className="h-full flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-[#718ba3] disabled:cursor-not-allowed disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="mr-6 flex text-[#8da9c2] transition hover:text-white disabled:opacity-50"
              >
                {showPassword ? (
                  <FiEyeOff size={21} />
                ) : (
                  <FiEye size={21} />
                )}
              </button>

            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="group flex h-[66px] w-full items-center justify-center gap-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-base font-semibold text-white shadow-[0_10px_25px_rgba(29,112,230,0.28)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_14px_30px_rgba(29,112,230,0.38)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              <span>
                {loading ? "Logging in..." : "Login"}
              </span>

              {!loading && (
                <FiArrowRight
                  size={22}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              )}

            </button>

          </form>

          {/* =====================================
              DIVIDER
          ===================================== */}
          <div className="my-8 flex items-center gap-5">

            <span className="h-px flex-1 bg-blue-200/20" />

            <span className="text-[13px] text-[#8299ad]">
              OR
            </span>

            <span className="h-px flex-1 bg-blue-200/20" />

          </div>

          {/* =====================================
              REGISTER
          ===================================== */}
          <p className="flex items-center justify-center gap-2 text-sm text-[#9aafc1]">

            <span>Don&apos;t have an account?</span>

            <Link
              href="/register"
              className="group flex items-center gap-1 font-medium text-blue-400 transition hover:text-blue-300"
            >
              Register

              <FiArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

          </p>

        </section>

      </div>
    </main>
  );
}

