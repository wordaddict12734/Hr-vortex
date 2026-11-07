import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      trim: true,
    },

    jobTitle: {
      type: String,
      trim: true,
    },

    employmentType: {
      type: String,
      trim: true,
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    responsibilities: {
      type: String,
      trim: true,
    },
  },
  {
    _id: true,
  }
);

const employeeProfileSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    
    // PERSONAL INFORMATION
    

    dateOfBirth: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say"],
      required: true,
    },

    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
      required: false,
    },

    alternatePhone: {
      type: String,
      trim: true,
    },

    personalEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
    },

    
    // EDUCATION
    

    education: {
      class10: {
        schoolName: {
          type: String,
          trim: true,
        },

        board: {
          type: String,
          trim: true,
        },

        yearOfPassing: {
          type: String,
          trim: true,
        },

        percentage: {
          type: String,
          trim: true,
        },
      },

      class12: {
        schoolName: {
          type: String,
          trim: true,
        },

        board: {
          type: String,
          trim: true,
        },

        yearOfPassing: {
          type: String,
          trim: true,
        },

        percentage: {
          type: String,
          trim: true,
        },
      },

      graduation: {
        collegeName: {
          type: String,
          trim: true,
        },

        university: {
          type: String,
          trim: true,
        },

        degree: {
          type: String,
          trim: true,
        },

        specialization: {
          type: String,
          trim: true,
        },

        yearOfPassing: {
          type: String,
          trim: true,
        },

        percentage: {
          type: String,
          trim: true,
        },
      },
    },

    
    // WORK EXPERIENCE
    

    isFresher: {
      type: Boolean,
      default: true,
    },

    experiences: {
      type: [experienceSchema],
      default: [],
    },
  },

  {
    timestamps: true,
  }
);

const EmployeeProfile =
  mongoose.models.EmployeeProfile ||
  mongoose.model("EmployeeProfile", employeeProfileSchema);

export default EmployeeProfile;