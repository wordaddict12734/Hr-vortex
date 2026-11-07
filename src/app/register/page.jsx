"use client";
import Image from "next/image";
import { useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiArrowRight,
} from "react-icons/fi";
import Link from "next/link";

export default function RegisterPage() {

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
  const { name, value } = e.target;


  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));


  };

  // Submit registration form
  const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);
  setMessage("");
  setError("");
  setValidationErrors({});

  const errors = {};

  // Full Name validation
  if (!formData.fullName.trim()) {
    errors.fullName = "Full name is required";
  } else if (formData.fullName.trim().length < 2) {
    errors.fullName = "Please enter your full name";
  } else if (!/^[A-Za-z\s]+$/.test(formData.fullName.trim())) {
    errors.fullName = "Full name can only contain letters";
  }

  // Email validation
  if (!formData.email.trim()) {
    errors.email = "Email address is required";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
  ) {
    errors.email = "Please enter a valid email address";
  }

  // Phone validation
  if (!formData.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^\d{10}$/.test(formData.phone.trim())) {
    errors.phone = "Phone number must contain exactly 10 digits";
  }

  // Stop if validation fails
  if (Object.keys(errors).length > 0) {
    setValidationErrors(errors);
    setLoading(false);
    return;
  }

  try {
    const response = await fetch("/api/employee-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Something went wrong");
      return;
    }

    setMessage(data.message);

    setFormData({
      fullName: "",
      email: "",
      phone: "",
    });
  } catch (error) {
    console.error("Registration error:", error);
    setError("Unable to submit registration. Please try again.");
  } finally {
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

    {/* LEFT SIDE */}
    <section className="hidden md:flex flex-col justify-between border-r border-blue-200/15 bg-[#071c2f]/60 px-14 py-14">

      <div className="flex flex-col items-center text-center mt-8">

        {/* Logo */}
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

    {/* RIGHT SIDE */}
    <section className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-[70px]">

      {/* Heading */}
      <div className="mb-7">

        <h2 className="text-4xl font-semibold text-white">
          Create Account
        </h2>

        <p className="mt-2 text-base text-[#91a8bc]">
          Submit your details to request an employee account
        </p>

      </div>

      {/* SUCCESS MESSAGE */}
      {message && (
        <div className="mb-5 rounded-xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-center text-sm text-green-300">
          {message}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
          {error}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit}>

        {/* FULL NAME */}
        <div className="mb-5">

          <div className="flex h-[66px] items-center rounded-full border border-blue-200/30 bg-[#041422]/35 transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-400/10">

            <FiUser
              size={21}
              className="ml-6 shrink-0 text-[#9ab7d1]"
            />
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="h-full flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-[#718ba3]"
            />

          </div>

          {validationErrors.fullName && ( 
            <p className="mt-2 ml-5 text-xs text-red-400">
          {validationErrors.fullName} </p>
          )}

        </div>

        {/* EMAIL */}

        <div className="mb-5">

          <div className="flex h-[66px] items-center rounded-full border border-blue-200/30 bg-[#041422]/35 transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-400/10">
            <FiMail
            size={21}
            className="ml-6 shrink-0 text-[#9ab7d1]"
            />

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="h-full flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-[#718ba3]"
            />
          </div>

          {validationErrors.email && ( 
            <p className="mt-2 ml-5 text-xs text-red-400">
          {validationErrors.email} </p>
          )}
        </div>

        {/* PHONE */}
        <div className="mb-6">

          <div className="flex h-[66px] items-center rounded-full border border-blue-200/30 bg-[#041422]/35 transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-400/10">

            <FiPhone
              size={21}
              className="ml-6 shrink-0 text-[#9ab7d1]"
            />

            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
              className="h-full flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-[#718ba3]"
            />
          </div>
          {validationErrors.phone && (
              <p className="mt-2 ml-5 text-xs text-red-400">
                {validationErrors.phone}
              </p>
            )}

        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="group flex h-[66px] w-full items-center justify-center gap-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-base font-semibold text-white shadow-[0_10px_25px_rgba(29,112,230,0.28)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_14px_30px_rgba(29,112,230,0.38)] disabled:cursor-not-allowed disabled:opacity-60"
        >

          <span>
            {loading ? "Submitting..." : "Submit Registration"}
          </span>

          {!loading && (
            <FiArrowRight
              size={22}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          )}

        </button>

      </form>

      {/* Bottom information */}
      <div className="mt-8 flex items-center gap-5">
        <span className="h-px flex-1 bg-blue-200/20" />

        <span className="text-[13px] text-[#8299ad]">
          REQUEST
        </span>

        <span className="h-px flex-1 bg-blue-200/20" />

      </div>

      <p className="mt-5 text-center text-xs leading-relaxed text-[#718ba3]">
        Your registration will remain pending until approved by an
        administrator.
      </p>

      <p className="mt-6 flex items-center justify-center gap-2 text-sm text-[#9aafc1]">
        <span>Already have an account?</span>

        <Link
          href="/"
          className="group flex items-center gap-1 font-medium text-blue-400 transition hover:text-blue-300"
        >
          Sign In

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
