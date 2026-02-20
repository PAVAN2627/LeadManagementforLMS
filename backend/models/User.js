import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "manager", "agent"],
      default: "agent",
    }, contact: {
      type: String,
      required: function () {
        return this.role !== "admin";
      },
    },
    department: {
      type: String,
      enum: ["sales", "Marketing", "support", "Administration"],
      required: function () {
        return this.role !== "admin";
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
