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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      description: "The resume used to generate the cover letter",
    }
  },
  { timestamps: true }
);

const CoverLetter = mongoose.model("CoverLetter", CoverLetterSchema);
export default CoverLetter;
