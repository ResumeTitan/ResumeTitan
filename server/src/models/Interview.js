import mongoose from "mongoose";

const InterviewQuestionSchema = new mongoose.Schema(
  {

    question: {
      type: String,
      description: "The questions asked during the interview",
    },
    example: {
      type: String,
      description: "Sample answers to the questions",
    },
    guidance: {
      type: String,
      description: "Guidance on how to answer the questions",
    },
  },
  { timestamps: true }
);

const InterviewSchema = new mongoose.Schema(
  {
    interview: {
      type: [InterviewQuestionSchema],
      description: "The interview questions",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      description: "The user who created the interview question",
    }
  },
  { timestamps: true }
);

const Interview = mongoose.model("Interview", InterviewSchema);
export default Interview;
