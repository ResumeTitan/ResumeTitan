import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    jobs: {
      type: Array,
      required: true,
      max: 5,
    },
    schools: {
      type: Array,
      required: true,
      max: 5,
    },
    objective: {
      type: String
    },
    skills: {
      type: Array
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", ResumeSchema);
export default Resume;