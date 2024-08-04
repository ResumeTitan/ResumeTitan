import mongoose from "mongoose";

const CoverLetterSchema = new mongoose.Schema(
  {
    coverLetter: {
      type: String,
      description: "The interview questions",
    },
    jobTitle: {
      type: String,
      description: "Title of the job being interviewed for"
    },
    jobDescription: {
      type: String,
      description: "Description of the job being interviewed for"
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      description: "The user who created the interview question",
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
