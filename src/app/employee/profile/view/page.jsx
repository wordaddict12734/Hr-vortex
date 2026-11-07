"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiHome,
  FiBookOpen,
  FiBriefcase,
  FiEdit3,
  FiArrowLeft,
  FiCheckCircle,
} from "react-icons/fi";

export default function EmployeeProfileViewPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error("Failed to parse user:", error);
      localStorage.removeItem("user");
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (!user?.id) return;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/employee/profile?employeeId=${user.id}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          setError(data.message || "Failed to load profile");
          return;
        }

        setProfile(data.data);
      } catch (error) {
        console.error("Profile loading error:", error);
        setError("Something went wrong while loading your profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const formatDate = (date) => {
    if (!date) return "Not provided";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Not provided";
    }
  };

  const formatShortDate = (date) => {
    if (!date) return "Present";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Present";
    }
  };

  const displayValue = (value) => {
    if (value === undefined || value === null || value === "") {
      return "Not provided";
    }

    return value;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071421] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#071421] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
            <FiUser className="text-2xl text-red-400" />
          </div>

          <h2 className="text-xl font-semibold">Profile Not Found</h2>

          <p className="mt-2 text-sm text-gray-400">
            {error || "Your employee profile has not been completed yet."}
          </p>

          <button
            onClick={() => router.push("/employee/profile")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            <FiEdit3 />
            Complete Profile
          </button>
        </div>
      </div>
    );
  }

  const education = profile.education || {};
  const class10 = education.class10 || {};
  const class12 = education.class12 || {};
  const graduation = education.graduation || {};

  return (
    <div className="min-h-screen bg-[#071421] text-white px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              onClick={() => router.push("/employee")}
              className="mb-4 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
            >
              <FiArrowLeft />
              Back to Dashboard
            </button>

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
                <FiUser className="text-2xl text-blue-400" />
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  My Profile
                </h1>
                <p className="mt-1 text-sm text-gray-400">
                  View your employee information and profile details
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push("/employee/profile")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            <FiEdit3 />
            Update Profile
          </button>
        </div>

        {/* Profile completion */}
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10">
            <FiCheckCircle className="text-emerald-400" />
          </div>

          <div>
            <p className="text-sm font-medium text-emerald-300">
              Profile Completed
            </p>
            <p className="text-xs text-gray-500">
              Your employee profile information is saved successfully.
            </p>
          </div>
        </div>

        {/* Account Information */}
        <ProfileSection
          icon={<FiUser />}
          title="Account Information"
          description="Basic information associated with your employee account"
        >
          <InfoItem
            label="Full Name"
            value={displayValue(user?.fullName)}
            icon={<FiUser />}
          />

          <InfoItem
            label="Email"
            value={displayValue(user?.email)}
            icon={<FiMail />}
          />

          <InfoItem
            label="Phone"
            value={displayValue(user?.phone)}
            icon={<FiPhone />}
          />

          <InfoItem
            label="Employee ID"
            value={displayValue(profile.employeeId)}
            icon={<FiUser />}
          />
        </ProfileSection>

        {/* Personal Information */}
        <ProfileSection
          icon={<FiUser />}
          title="Personal Information"
          description="Your personal and demographic details"
        >
          <InfoItem
            label="Date of Birth"
            value={formatDate(profile.dateOfBirth)}
            icon={<FiCalendar />}
          />

          <InfoItem
            label="Gender"
            value={displayValue(profile.gender)}
            icon={<FiUser />}
          />

          <InfoItem
            label="Marital Status"
            value={displayValue(profile.maritalStatus)}
            icon={<FiUser />}
          />

          <InfoItem
            label="Personal Email"
            value={displayValue(profile.personalEmail)}
            icon={<FiMail />}
          />

          <InfoItem
            label="Alternate Phone"
            value={displayValue(profile.alternatePhone)}
            icon={<FiPhone />}
          />
        </ProfileSection>

        {/* Address */}
        <ProfileSection
          icon={<FiMapPin />}
          title="Address Information"
          description="Your current residential address"
        >
          <div className="md:col-span-2">
            <InfoItem
              label="Address"
              value={displayValue(profile.address)}
              icon={<FiHome />}
            />
          </div>

          <InfoItem
            label="City"
            value={displayValue(profile.city)}
            icon={<FiMapPin />}
          />

          <InfoItem
            label="State / UT"
            value={displayValue(profile.state)}
            icon={<FiMapPin />}
          />

          <InfoItem
            label="Pincode"
            value={displayValue(profile.pincode)}
            icon={<FiMapPin />}
          />
        </ProfileSection>

        {/* Education */}
        <ProfileSection
          icon={<FiBookOpen />}
          title="Education"
          description="Your academic qualifications"
        >
          {/* Class 10 */}
          <EducationCard
            title="Class 10"
            data={class10}
            fields={[
              ["School Name", class10.schoolName],
              ["Board", class10.board],
              ["Year of Passing", class10.yearOfPassing],
              ["Percentage", class10.percentage],
            ]}
          />

          {/* Class 12 */}
          <EducationCard
            title="Class 12"
            data={class12}
            fields={[
              ["School Name", class12.schoolName],
              ["Board", class12.board],
              ["Year of Passing", class12.yearOfPassing],
              ["Percentage", class12.percentage],
            ]}
          />

          {/* Graduation */}
          <div className="md:col-span-2">
            <EducationCard
              title="Graduation"
              data={graduation}
              fields={[
                ["College Name", graduation.collegeName],
                ["University", graduation.university],
                ["Degree", graduation.degree],
                ["Specialization", graduation.specialization],
                ["Year of Passing", graduation.yearOfPassing],
                ["Percentage / CGPA", graduation.percentage],
              ]}
            />
          </div>
        </ProfileSection>

        {/* Work Experience */}
        <ProfileSection
          icon={<FiBriefcase />}
          title="Work Experience"
          description="Your previous employment information"
        >
          {profile.isFresher ? (
            <div className="md:col-span-2 rounded-xl border border-blue-500/20 bg-blue-500/[0.05] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <FiUser className="text-blue-400" />
                </div>

                <div>
                  <p className="text-sm font-medium text-white">
                    Fresher
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    No previous work experience has been provided.
                  </p>
                </div>
              </div>
            </div>
          ) : profile.experiences?.length > 0 ? (
            <div className="md:col-span-2 space-y-4">
              {profile.experiences.map((experience, index) => (
                <div
                  key={experience._id || index}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                        <FiBriefcase className="text-blue-400" />
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500">
                          Experience {index + 1}
                        </p>

                        <h3 className="mt-1 text-base font-medium text-white">
                          {displayValue(experience.jobTitle)}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <InfoItem
                      label="Company Name"
                      value={displayValue(experience.companyName)}
                      icon={<FiBriefcase />}
                    />

                    <InfoItem
                      label="Job Title"
                      value={displayValue(experience.jobTitle)}
                      icon={<FiUser />}
                    />

                    <InfoItem
                      label="Employment Type"
                      value={displayValue(experience.employmentType)}
                      icon={<FiBriefcase />}
                    />

                    <InfoItem
                      label="Duration"
                      value={`${formatShortDate(
                        experience.startDate
                      )} — ${formatShortDate(experience.endDate)}`}
                      icon={<FiCalendar />}
                    />

                    <div className="md:col-span-2">
                      <InfoItem
                        label="Responsibilities"
                        value={displayValue(experience.responsibilities)}
                        icon={<FiBriefcase />}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="md:col-span-2 rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <p className="text-sm text-gray-400">
                No work experience has been provided.
              </p>
            </div>
          )}
        </ProfileSection>

        {/* Bottom Update Button */}
        <div className="mt-8 flex justify-end border-t border-white/10 pt-6">
          <button
            onClick={() => router.push("/employee/profile")}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-5 py-3 text-sm font-medium text-blue-300 transition hover:bg-blue-500/20 hover:text-blue-200"
          >
            <FiEdit3 />
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   Profile Section
--------------------------------------------- */

function ProfileSection({ icon, title, description, children }) {
  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="border-b border-white/10 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            {icon}
          </div>

          <div>
            <h2 className="text-base font-semibold text-white">{title}</h2>
            <p className="mt-1 text-xs text-gray-500">{description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

/* ---------------------------------------------
   Information Item
--------------------------------------------- */

function InfoItem({ label, value, icon }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
        {label}
      </p>

      <div className="flex min-h-[46px] items-center gap-3 rounded-xl border border-white/10 bg-[#071421]/60 px-4 py-3">
        <span className="shrink-0 text-blue-400">{icon}</span>

        <p className="break-words text-sm text-gray-200">{value}</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   Education Card
--------------------------------------------- */

function EducationCard({ title, fields }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
          <FiBookOpen className="text-blue-400" />
        </div>

        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map(([label, value]) => (
          <InfoItem
            key={label}
            label={label}
            value={
              value !== undefined && value !== null && value !== ""
                ? value
                : "Not provided"
            }
            icon={<FiBookOpen />}
          />
        ))}
      </div>
    </div>
  );
}