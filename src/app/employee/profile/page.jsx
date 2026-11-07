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
  FiArrowLeft,
  FiArrowRight,
  FiBookOpen,
  FiBriefcase,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

const indianStatesAndUTs = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",

  // Union Territories
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export default function EmployeeProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);

  const [currentStep, setCurrentStep] = useState(1);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  
  // PERSONAL INFORMATION
  

  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",

    alternatePhone: "",
    personalEmail: "",

    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  
  // EDUCATION INFORMATION
  

  const [educationData, setEducationData] = useState({
    class10: {
      schoolName: "",
      board: "",
      yearOfPassing: "",
      percentage: "",
    },

    class12: {
      schoolName: "",
      board: "",
      yearOfPassing: "",
      percentage: "",
    },

    graduation: {
      collegeName: "",
      university: "",
      degree: "",
      specialization: "",
      yearOfPassing: "",
      percentage: "",
    },
  });

  
  // WORK EXPERIENCE
  

  const [isFresher, setIsFresher] = useState(true);

  const [experienceData, setExperienceData] = useState([
    {
      companyName: "",
      jobTitle: "",
      employmentType: "",
      startDate: "",
      endDate: "",
      responsibilities: "",
    },
  ]);

  
  // LOAD USER
  

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      setUser(parsedUser);

      setFormData((prev) => ({
        ...prev,
        personalEmail: parsedUser.email || "",
      }));
    } catch (error) {
      console.error("Failed to load user:", error);
      router.push("/");
    }
  }, [router]);

  // getting user profile
  useEffect(() => {
  const loadProfile = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `/api/employee/profile?employeeId=${user.id}`
      );

      const data = await response.json();

      // A brand-new employee may not have a profile yet.
      if (!response.ok || !data.success) {
        return;
      }

      const profile = data.data;

      
      // PERSONAL INFORMATION
      

      setFormData({
        dateOfBirth: profile.dateOfBirth
          ? profile.dateOfBirth.split("T")[0]
          : "",
        gender: profile.gender || "",
        maritalStatus: profile.maritalStatus || "",
        alternatePhone: profile.alternatePhone || "",
        personalEmail: profile.personalEmail || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        pincode: profile.pincode || "",
      });

      
      // EDUCATION INFORMATION
      

      setEducationData({
        class10: {
          schoolName: profile.education?.class10?.schoolName || "",
          board: profile.education?.class10?.board || "",
          yearOfPassing:
            profile.education?.class10?.yearOfPassing || "",
          percentage:
            profile.education?.class10?.percentage || "",
        },

        class12: {
          schoolName: profile.education?.class12?.schoolName || "",
          board: profile.education?.class12?.board || "",
          yearOfPassing:
            profile.education?.class12?.yearOfPassing || "",
          percentage:
            profile.education?.class12?.percentage || "",
        },

        graduation: {
          collegeName:
            profile.education?.graduation?.collegeName || "",
          university:
            profile.education?.graduation?.university || "",
          degree:
            profile.education?.graduation?.degree || "",
          specialization:
            profile.education?.graduation?.specialization || "",
          yearOfPassing:
            profile.education?.graduation?.yearOfPassing || "",
          percentage:
            profile.education?.graduation?.percentage || "",
        },
      });

      
      // WORK EXPERIENCE
      

      setIsFresher(profile.isFresher ?? true);

      if (profile.experiences?.length > 0) {
        setExperienceData(
          profile.experiences.map((experience) => ({
            companyName: experience.companyName || "",
            jobTitle: experience.jobTitle || "",
            employmentType: experience.employmentType || "",
            startDate: experience.startDate
              ? experience.startDate.split("T")[0]
              : "",
            endDate: experience.endDate
              ? experience.endDate.split("T")[0]
              : "",
            responsibilities:
              experience.responsibilities || "",
          }))
        );
      } else {
        setExperienceData([
          {
            companyName: "",
            jobTitle: "",
            employmentType: "",
            startDate: "",
            endDate: "",
            responsibilities: "",
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to load employee profile:", error);
    }
  };

  loadProfile();
}, [user]);

  
  // PERSONAL FORM CHANGE
  

  const handleChange = (event) => {
    const { name, value } = event.target;
     
    if (name === "pincode") {
      const numbersOnly = value.replace(/\D/g, "").slice(0, 6);

      setFormData((prev) => ({
        ...prev,
        pincode: numbersOnly,
      }));

      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  // EDUCATION FORM CHANGE
  

  const handleEducationChange = (section, field, value) => {
      if (field === "percentage") {
      // Allow only numbers and one decimal point
      value = value.replace(/[^0-9.]/g, "");

      // Allow only one decimal point
      const parts = value.split(".");

      if (parts.length > 2) {
        value = parts[0] + "." + parts.slice(1).join("");
      }
    }

    if (field === "yearOfPassing") {
      // Allow only numbers
      value = value.replace(/\D/g, "");

      // Maximum 4 digits
      value = value.slice(0, 4);
    }
    setEducationData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  
  // EXPERIENCE FORM CHANGE
  

  const handleExperienceChange = (index, field, value) => {
    setExperienceData((prev) =>
      prev.map((experience, i) =>
        i === index
          ? {
              ...experience,
              [field]: value,
            }
          : experience
      )
    );
  };

  
  // ADD EXPERIENCE
  

  const addExperience = () => {
    setExperienceData((prev) => [
      ...prev,
      {
        companyName: "",
        jobTitle: "",
        employmentType: "",
        startDate: "",
        endDate: "",
        responsibilities: "",
      },
    ]);
  };

  
  // REMOVE EXPERIENCE
  

  const removeExperience = (index) => {
    setExperienceData((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  
  // SAVE PERSONAL INFORMATION
  

  const savePersonalInformation = async () => {
    if (!user?.id) {
      setError("Employee information not found.");
      return false;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch("/api/employee/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: user.id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to save profile.");
        return false;
      }

      setMessage(data.message);

      return true;
    } catch (error) {
      console.error("Profile save error:", error);

      setError("Something went wrong while saving your profile.");

      return false;
    } finally {
      setLoading(false);
    }
  };

  
// SAVE EDUCATION INFORMATION


const saveEducation = async () => {
  if (!user?.id) {
    setError("Employee information not found.");
    return false;
  }

  try {
    setLoading(true);
    setError("");
    setMessage("");

    const currentYear = new Date().getFullYear();

    const educationSections = [
      educationData.class10,
      educationData.class12,
      educationData.graduation,
    ];

    for (const section of educationSections) {
      const year = Number(section.yearOfPassing);

      if (
        !section.yearOfPassing ||
        section.yearOfPassing.length !== 4 ||
        year < 1950 ||
        year > currentYear
      ) {
        setError(
          `Please enter a valid year of passing between 1950 and ${currentYear}.`
        );
        return false;
      }
    }

    const response = await fetch("/api/employee/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employeeId: user.id,

        education: educationData,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(
        data.message || "Failed to save education details."
      );

      return false;
    }

    setMessage("Education details saved successfully.");

    return true;
  } catch (error) {
    console.error(
      "Education save error:",
      error
    );

    setError(
      "Something went wrong while saving education details."
    );

    return false;
  } finally {
    setLoading(false);
  }
};


// SAVE WORK EXPERIENCE


const saveWorkExperience = async () => {
  if (!user?.id) {
    setError("Employee information not found.");
    return false;
  }

  try {
    setLoading(true);
    setError("");
    setMessage("");

    const response = await fetch("/api/employee/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employeeId: user.id,
        isFresher,
        experiences: isFresher ? [] : experienceData,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(
        data.message || "Failed to save work experience."
      );

      return false;
    }

    setMessage("Work experience saved successfully.");

    return true;
  } catch (error) {
    console.error("Work experience save error:", error);

    setError(
      "Something went wrong while saving work experience."
    );

    return false;
  } finally {
    setLoading(false);
  }
};

  
  // SAVE & NEXT
  

  const handleNext = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    // STEP 1
    if (currentStep === 1) {
      const saved = await savePersonalInformation();

      if (!saved) {
        return;
      }

      setCurrentStep(2);

      return;
    }

    // STEP 2
    if (currentStep === 2) {
      const saved = await saveEducation();

      if (!saved) {
        return;
      }

      setCurrentStep(3);

      return;
    }

    // STEP 3
    if (currentStep === 3) {
      const saved = await saveWorkExperience();

      if (!saved) {
        return;
      }
      router.push("/employee/profile/view");
    }
  };

  
  // GO BACK
  

  const handleBack = () => {
    setError("");
    setMessage("");

    if (currentStep === 1) {
      router.push("/employee/documents");
      return;
    }

    setCurrentStep((prev) => prev - 1);
  };

  
  // LOADING SCREEN
  

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#071421] text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071421] px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl">

        {/*HEADER*/}

        <div className="mb-8">

          <button
            type="button"
            onClick={handleBack}
            className="mb-5 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <FiArrowLeft />
            {currentStep === 1
              ? "Back to Documents"
              : "Back"}
          </button>

          <div className="flex items-start justify-between gap-6">

            <div>

              <div className="mb-3 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  {currentStep === 1 && <FiUser size={22} />}
                  {currentStep === 2 && <FiBookOpen size={22} />}
                  {currentStep === 3 && <FiBriefcase size={22} />}
                </div>

                <div>

                  <p className="text-xs font-medium uppercase tracking-wider text-blue-400">
                    Employee Onboarding
                  </p>

                  <h1 className="text-2xl font-semibold">
                    {currentStep === 1 &&
                      "Complete Your Profile"}

                    {currentStep === 2 &&
                      "Education Details"}

                    {currentStep === 3 &&
                      "Work Experience"}
                  </h1>

                </div>

              </div>

              <p className="max-w-2xl text-sm leading-6 text-slate-400">

                {currentStep === 1 &&
                  "Please provide your personal and contact information."}

                {currentStep === 2 &&
                  "Provide your academic and educational information."}

                {currentStep === 3 &&
                  "Tell us about your previous work experience."}

              </p>

            </div>

          </div>
        </div>


        {/*STEP INDICATOR*/}

        <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">

          <div className="flex items-center justify-between">

            {/* STEP 1 */}

            <StepIndicator
              number="01"
              title="Personal"
              active={currentStep === 1}
              completed={currentStep > 1}
            />

            <StepLine active={currentStep > 1} />

            {/* STEP 2 */}

            <StepIndicator
              number="02"
              title="Education"
              active={currentStep === 2}
              completed={currentStep > 2}
            />

            <StepLine active={currentStep > 2} />

            {/* STEP 3 */}

            <StepIndicator
              number="03"
              title="Experience"
              active={currentStep === 3}
              completed={false}
            />

          </div>

        </div>


        {/*SUCCESS / ERROR*/}

        {message && (
          <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}


        {/*FORM*/}

        <form onSubmit={handleNext}>

          {/*  STEP 1
          ===================================== */}

          {currentStep === 1 && (
            <>
              {/* PERSONAL INFORMATION */}

              <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl">

                <SectionHeader
                  icon={<FiUser />}
                  title="Personal Information"
                  subtitle="Basic information about you"
                />

                <div className="grid gap-5 md:grid-cols-2">

                  <InputField
                    label="Full Name"
                    value={user.fullName}
                    icon={<FiUser />}
                    disabled
                  />

                  <InputField
                    label="Email Address"
                    value={user.email}
                    icon={<FiMail />}
                    disabled
                  />

                  <InputField
                    label="Phone Number"
                    value={user.phone || ""}
                    icon={<FiPhone />}
                    disabled
                  />

                  <InputField
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    icon={<FiCalendar />}
                    required
                  />

                  <SelectField
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={[
                      "Male",
                      "Female",
                      "Other",
                      "Prefer not to say",
                    ]}
                    required
                  />

                  <SelectField
                    label="Marital Status"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    options={[
                      "Single",
                      "Married",
                      "Divorced",
                      "Widowed",
                    ]}
                  />

                </div>

              </section>


              {/* CONTACT INFORMATION */}

              <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl">

                <SectionHeader
                  icon={<FiPhone />}
                  title="Contact Information"
                  subtitle="Additional contact details"
                />

                <div className="grid gap-5 md:grid-cols-2">

                  <InputField
                    label="Personal Email"
                    name="personalEmail"
                    type="email"
                    value={formData.personalEmail}
                    onChange={handleChange}
                    icon={<FiMail />}
                  />

                  <InputField
                    label="Alternate Phone"
                    name="alternatePhone"
                    type="tel"
                    value={formData.alternatePhone}
                    onChange={handleChange}
                    icon={<FiPhone />}
                  />

                </div>

              </section>


              {/* ADDRESS */}

              <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl">

                <SectionHeader
                  icon={<FiMapPin />}
                  title="Address"
                  subtitle="Your current residential address"
                />

                <div className="grid gap-5 md:grid-cols-2">

                  <div className="md:col-span-2">

                    <label className="mb-2 block text-sm text-slate-300">
                      Address
                      <span className="ml-1 text-blue-400">
                        *
                      </span>
                    </label>

                    <div className="relative">

                      <FiHome className="absolute left-4 top-4 text-slate-500" />

                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        required
                        placeholder="Enter your complete address"
                        className="w-full resize-none rounded-xl border border-white/10 bg-[#0b1b2a] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50"
                      />

                    </div>

                  </div>

                  <InputField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    icon={<FiMapPin />}
                    required
                  />

                  <SelectField
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    options={indianStatesAndUTs}
                    required
                  />

                  <InputField
                    label="Pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter 6-digit pincode"
                    required
                    maxLength={6}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />

                </div>

              </section>
            </>
          )}


          {/*  STEP 2 - EDUCATION
          ===================================== */}

          {currentStep === 2 && (
            <>
              {/* CLASS 10 */}

              <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl">

                <SectionHeader
                  icon={<FiBookOpen />}
                  title="Class 10"
                  subtitle="Secondary education details"
                />

                <div className="grid gap-5 md:grid-cols-2">

                  <InputField
                    label="School Name"
                    value={educationData.class10.schoolName}
                    onChange={(event) =>
                      handleEducationChange(
                        "class10",
                        "schoolName",
                        event.target.value
                      )
                    }
                    icon={<FiBookOpen />}
                    required
                  />

                  <InputField
                    label="Board"
                    value={educationData.class10.board}
                    onChange={(event) =>
                      handleEducationChange(
                        "class10",
                        "board",
                        event.target.value
                      )
                    }
                    icon={<FiBookOpen />}
                    required
                  />

                  <InputField
                    label="Year of Passing"
                    type="number"
                    value={educationData.class10.yearOfPassing}
                    onChange={(event) =>
                      handleEducationChange(
                        "class10",
                        "yearOfPassing",
                        event.target.value
                      )
                    }
                    icon={<FiCalendar />}
                    required
                  />

                  <InputField
                    label="Percentage / CGPA"
                    value={educationData.class10.percentage}
                    onChange={(event) =>
                      handleEducationChange(
                        "class10",
                        "percentage",
                        event.target.value
                      )
                    }
                    icon={<FiBookOpen />}
                    required
                  />

                </div>

              </section>


              {/* CLASS 12 */}

              <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl">

                <SectionHeader
                  icon={<FiBookOpen />}
                  title="Class 12"
                  subtitle="Higher secondary education details"
                />

                <div className="grid gap-5 md:grid-cols-2">

                  <InputField
                    label="School Name"
                    value={educationData.class12.schoolName}
                    onChange={(event) =>
                      handleEducationChange(
                        "class12",
                        "schoolName",
                        event.target.value
                      )
                    }
                    icon={<FiBookOpen />}
                    required
                  />

                  <InputField
                    label="Board"
                    value={educationData.class12.board}
                    onChange={(event) =>
                      handleEducationChange(
                        "class12",
                        "board",
                        event.target.value
                      )
                    }
                    icon={<FiBookOpen />}
                    required
                  />

                  <InputField
                    label="Year of Passing"
                    type="number"
                    value={educationData.class12.yearOfPassing}
                    onChange={(event) =>
                      handleEducationChange(
                        "class12",
                        "yearOfPassing",
                        event.target.value
                      )
                    }
                    icon={<FiCalendar />}
                    required
                  />

                  <InputField
                    label="Percentage / CGPA"
                    value={educationData.class12.percentage}
                    onChange={(event) =>
                      handleEducationChange(
                        "class12",
                        "percentage",
                        event.target.value
                      )
                    }
                    icon={<FiBookOpen />}
                    required
                  />

                </div>

              </section>


              {/* GRADUATION */}

              <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl">

                <SectionHeader
                  icon={<FiBookOpen />}
                  title="Graduation"
                  subtitle="College and degree information"
                />

                <div className="grid gap-5 md:grid-cols-2">

                  <InputField
                    label="College / Institution"
                    value={educationData.graduation.collegeName}
                    onChange={(event) =>
                      handleEducationChange(
                        "graduation",
                        "collegeName",
                        event.target.value
                      )
                    }
                    icon={<FiBookOpen />}
                    required
                  />

                  <InputField
                    label="University"
                    value={educationData.graduation.university}
                    onChange={(event) =>
                      handleEducationChange(
                        "graduation",
                        "university",
                        event.target.value
                      )
                    }
                    icon={<FiBookOpen />}
                    required
                  />

                  <InputField
                    label="Degree"
                    value={educationData.graduation.degree}
                    onChange={(event) =>
                      handleEducationChange(
                        "graduation",
                        "degree",
                        event.target.value
                      )
                    }
                    icon={<FiBookOpen />}
                    required
                  />

                  <InputField
                    label="Specialization"
                    value={educationData.graduation.specialization}
                    onChange={(event) =>
                      handleEducationChange(
                        "graduation",
                        "specialization",
                        event.target.value
                      )
                    }
                    icon={<FiBookOpen />}
                    required
                  />

                  <InputField
                    label="Year of Passing"
                    type="number"
                    value={educationData.graduation.yearOfPassing}
                    onChange={(event) =>
                      handleEducationChange(
                        "graduation",
                        "yearOfPassing",
                        event.target.value
                      )
                    }
                    icon={<FiCalendar />}
                    required
                  />

                  <InputField
                    label="Percentage / CGPA"
                    value={educationData.graduation.percentage}
                    onChange={(event) =>
                      handleEducationChange(
                        "graduation",
                        "percentage",
                        event.target.value
                      )
                    }
                    icon={<FiBookOpen />}
                    required
                  />

                </div>

              </section>
            </>
          )}


          {/*  STEP 3 - WORK EXPERIENCE
          ===================================== */}

          {currentStep === 3 && (
            <>
              {/* FRESHER OPTION */}

              <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl">

                <SectionHeader
                  icon={<FiBriefcase />}
                  title="Work Experience"
                  subtitle="Tell us about your previous employment"
                />

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-[#0b1b2a] p-4 transition hover:border-blue-500/30">

                  <input
                    type="checkbox"
                    checked={isFresher}
                    onChange={(event) =>
                      setIsFresher(event.target.checked)
                    }
                    className="h-4 w-4 accent-blue-500"
                  />

                  <div>
                    <p className="text-sm font-medium text-white">
                      I am a fresher
                    </p>

                    <p className="text-xs text-slate-500">
                      I do not have any previous work experience.
                    </p>
                  </div>

                </label>

              </section>


              {/* EXPERIENCE */}

              {!isFresher && (
                <>
                  {experienceData.map((experience, index) => (
                    <section
                      key={index}
                      className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl"
                    >

                      <div className="mb-6 flex items-center justify-between">

                        <SectionHeader
                          icon={<FiBriefcase />}
                          title={`Experience ${index + 1}`}
                          subtitle="Previous employment details"
                        />

                        {experienceData.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeExperience(index)
                            }
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-400 transition hover:bg-red-500/10"
                          >
                            <FiTrash2 />
                            Remove
                          </button>
                        )}

                      </div>

                      <div className="grid gap-5 md:grid-cols-2">

                        <InputField
                          label="Company Name"
                          value={experience.companyName}
                          onChange={(event) =>
                            handleExperienceChange(
                              index,
                              "companyName",
                              event.target.value
                            )
                          }
                          icon={<FiBriefcase />}
                          required
                        />

                        <InputField
                          label="Job Title"
                          value={experience.jobTitle}
                          onChange={(event) =>
                            handleExperienceChange(
                              index,
                              "jobTitle",
                              event.target.value
                            )
                          }
                          icon={<FiUser />}
                          required
                        />

                        <SelectField
                          label="Employment Type"
                          value={experience.employmentType}
                          onChange={(event) =>
                            handleExperienceChange(
                              index,
                              "employmentType",
                              event.target.value
                            )
                          }
                          options={[
                            "Full Time",
                            "Part Time",
                            "Internship",
                            "Contract",
                            "Freelance",
                          ]}
                          required
                        />

                        <div />

                        <InputField
                          label="Start Date"
                          type="date"
                          value={experience.startDate}
                          onChange={(event) =>
                            handleExperienceChange(
                              index,
                              "startDate",
                              event.target.value
                            )
                          }
                          icon={<FiCalendar />}
                          required
                        />

                        <InputField
                          label="End Date"
                          type="date"
                          value={experience.endDate}
                          onChange={(event) =>
                            handleExperienceChange(
                              index,
                              "endDate",
                              event.target.value
                            )
                          }
                          icon={<FiCalendar />}
                        />

                        <div className="md:col-span-2">

                          <label className="mb-2 block text-sm text-slate-300">
                            Responsibilities
                          </label>

                          <textarea
                            value={experience.responsibilities}
                            onChange={(event) =>
                              handleExperienceChange(
                                index,
                                "responsibilities",
                                event.target.value
                              )
                            }
                            rows={4}
                            placeholder="Describe your responsibilities and work"
                            className="w-full resize-none rounded-xl border border-white/10 bg-[#0b1b2a] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50"
                          />

                        </div>

                      </div>

                    </section>
                  ))}

                  <button
                    type="button"
                    onClick={addExperience}
                    className="mb-8 flex items-center gap-2 rounded-xl border border-dashed border-white/20 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-white"
                  >
                    <FiPlus />
                    Add Another Experience
                  </button>
                </>
              )}
            </>
          )}


          {/*  BOTTOM ACTIONS
          ===================================== */}

          <div className="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">

            <button
              type="button"
              onClick={handleBack}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <FiArrowLeft />
              Back
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : currentStep === 3
                ? "Save & Finish"
                : "Save & Next"}

              {!loading && <FiArrowRight />}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}


/* =========================================================
   STEP INDICATOR
========================================================= */

function StepIndicator({
  number,
  title,
  active,
  completed,
}) {
  return (
    <div className="flex items-center gap-3">

      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${
          completed
            ? "bg-blue-500 text-white"
            : active
            ? "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40"
            : "bg-white/5 text-slate-500"
        }`}
      >
        {completed ? "✓" : number}
      </div>

      <div className="hidden sm:block">

        <p
          className={`text-xs font-medium ${
            active || completed
              ? "text-white"
              : "text-slate-500"
          }`}
        >
          {title}
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   STEP LINE
========================================================= */

function StepLine({ active }) {
  return (
    <div
      className={`mx-3 h-px flex-1 ${
        active
          ? "bg-blue-500/60"
          : "bg-white/10"
      }`}
    />
  );
}


/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  icon,
  title,
  subtitle,
}) {
  return (
    <div className="mb-6 flex items-center gap-3">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
        {icon}
      </div>

      <div>

        <h2 className="font-semibold">
          {title}
        </h2>

        <p className="text-xs text-slate-500">
          {subtitle}
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   REUSABLE INPUT
========================================================= */

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  icon,
  disabled = false,
  required = false,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm text-slate-300">

        {label}

        {required && (
          <span className="ml-1 text-blue-400">
            *
          </span>
        )}

      </label>

      <div className="relative">

        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            {icon}
          </span>
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full rounded-xl border border-white/10 py-3 ${
            icon ? "pl-11" : "px-4"
          } pr-4 text-sm outline-none transition ${
            disabled
              ? "cursor-not-allowed bg-[#091725] text-slate-500"
              : "bg-[#0b1b2a] text-white placeholder:text-slate-600 focus:border-blue-500/50"
          }`}
        />

      </div>

    </div>
  );
}


/* =========================================================
   REUSABLE SELECT
========================================================= */

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm text-slate-300">

        {label}

        {required && (
          <span className="ml-1 text-blue-400">
            *
          </span>
        )}

      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-[#0b1b2a] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500/50"
      >

        <option
          value=""
          className="bg-[#0b1b2a]"
        >
          Select {label}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-[#0b1b2a]"
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}