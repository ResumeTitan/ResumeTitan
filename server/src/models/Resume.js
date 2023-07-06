import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    jobs: {
      type: Array,
      required: true,
      max: 10,
    },
    schools: {
      type: String,
      required: true,
      min: 5,
    },
    objective: {
      type: String
    }
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", ResumeSchema);
export default Resume;