"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  if (formData.newPassword.length < 8) {
    setError("Password must be at least 8 characters long.");
    return;
  }

  if (formData.newPassword !== formData.confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  setLoading(true);

  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setError("Session expired. Please login again.");
      setLoading(false);
      return;
    }

    const user = JSON.parse(storedUser);

    const response = await fetch("/api/employee/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        newPassword: formData.newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Failed to update password.");
      setLoading(false);
      return;
    }

    // Password changed successfully
    router.push("/employee");

  } catch (error) {
    console.error("Change password error:", error);
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

          {/* Security message */}
          <div className="text-center">

            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-blue-300/20 bg-blue-500/10 text-blue-400">
              <FiShield size={22} />
            </div>

            <p className="text-[13px] tracking-[1px] text-[#91a8bc]">
              Your account is protected
              <span className="mx-2 text-[#52738e]">•</span>
              Keep your password private
            </p>

          </div>

        </section>


        {/* =====================================
            RIGHT SIDE
        ===================================== */}
        <section className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-[70px]">

          {/* Heading */}
          <div className="mb-8">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-blue-300/20 bg-blue-500/10 text-blue-400">
              <FiLock size={21} />
            </div>

            <h2 className="text-4xl font-semibold text-white">
              Set Your Password
            </h2>

            <p className="mt-3 text-base leading-6 text-[#91a8bc]">
              Welcome to HR Vortex. Please create a new password
              to secure your employee account.
            </p>

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

            {/* NEW PASSWORD */}
            <div className="mb-5 flex h-[66px] items-center rounded-full border border-blue-200/30 bg-[#041422]/35 transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-400/10">

              <FiLock
                size={21}
                className="ml-6 shrink-0 text-[#9ab7d1]"
              />

              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="New Password"
                required
                disabled={loading}
                className="h-full flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-[#718ba3] disabled:cursor-not-allowed disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={loading}
                className="mr-6 flex text-[#8da9c2] transition hover:text-white disabled:opacity-50"
              >
                {showNewPassword ? (
                  <FiEyeOff size={21} />
                ) : (
                  <FiEye size={21} />
                )}
              </button>

            </div>


            {/* CONFIRM PASSWORD */}
            <div className="mb-4 flex h-[66px] items-center rounded-full border border-blue-200/30 bg-[#041422]/35 transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-400/10">

              <FiLock
                size={21}
                className="ml-6 shrink-0 text-[#9ab7d1]"
              />

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm New Password"
                required
                disabled={loading}
                className="h-full flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-[#718ba3] disabled:cursor-not-allowed disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                disabled={loading}
                className="mr-6 flex text-[#8da9c2] transition hover:text-white disabled:opacity-50"
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={21} />
                ) : (
                  <FiEye size={21} />
                )}
              </button>

            </div>


            {/* PASSWORD REQUIREMENT */}
            <div className="mb-7 flex items-center gap-2 px-2 text-xs text-[#718ba3]">
              <FiCheckCircle size={14} />
              <span>Password must contain at least 8 characters</span>
            </div>


            {/* UPDATE BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="group flex h-[66px] w-full items-center justify-center gap-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-base font-semibold text-white shadow-[0_10px_25px_rgba(29,112,230,0.28)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_14px_30px_rgba(29,112,230,0.38)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >

              <span>
                {loading ? "Updating Password..." : "Update Password"}
              </span>

              {!loading && (
                <FiArrowRight
                  size={22}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              )}

            </button>

          </form>


          {/* Bottom note */}
          <p className="mt-7 text-center text-xs leading-5 text-[#718ba3]">
            Choose a password that you do not use for any other account.
          </p>

        </section>

      </div>

    </main>
  );
}