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
      description: "Guidance on how to answer the question",
    },
    answer: {
      type: String,
      required: false,
      description: "A response from the user"
    }
  },
  { timestamps: true }
);

const InterviewSchema = new mongoose.Schema(
  {
    questions: {
      type: [InterviewQuestionSchema],
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
    company: {
      type: String,
      description: "Name of the company being interviewed for"
    },
    jobUrl: {
      type: String,
      description: "URL of the job posting, if provided"
    },
    clerkId: {
      type: String,
      required: true,
      description: "The clerk id of user who created the interview question",
    }
  },
  { timestamps: true }
);

const Interview = mongoose.model("Interview", InterviewSchema);
export default Interview;
