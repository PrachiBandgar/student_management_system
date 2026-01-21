import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      required: true
    },

    // ✅ NEW: STATUS WITH MULTIPLE OPTIONS
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "graduated", "on-leave"],
      default: "active"
    },

    // Common fields
    department: {
      type: String,
      default: ""
    },

    phone: {
      type: String,
      default: ""
    },

    // Teacher-specific (optional)
    subject: {
      type: String,
      default: ""
    },

    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
