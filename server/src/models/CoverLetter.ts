import mongoose from "mongoose";

const CoverLetterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      description: "Name of the cover letter writer"
    },
    date: {
      type: Date,
      description: "Date of writing cover letter"
    },
    letter: {
      type: String,
      description: "The content of the cover letter",
    },
    jobTitle: {
      type: String,
      description: "Title of the job being interviewed for"
    },
    jobDescription: {
      type: String,
      description: "Description of the job being interviewed for"
    },
    clerkId: {
      type: String,
      required: true,
      description: "The clerk id of the user who created the interview question",
    },
    resumeId: {
      type: String,
      ref: "Resume",
      description: "The resume used to generate the cover letter",
    },
    city: {
      type: String,
      description: "User city"
    },
    state: {
      type: String,
      description: "User state"
    },
    company: {
      type: String,
      description: "Name of the company sending a cover letter to"
    }
  },
  { timestamps: true }
);

const CoverLetter = mongoose.model("CoverLetter", CoverLetterSchema);
export default CoverLetter;
