import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      default: 0,
      description: "Job ID from the current resume",
    },
    title: {
      type: String,
      description: "Job title",
    },
    employer: {
      type: String,
      description: "Name of employer",
    },
    city: {
      type: String,
      description: "City of employer",
    },
    state: {
      type: String,
      description: "State of employer",
    },
    startDateMonth: {
      type: String,
      description: "Month of start date",
    },
    startDateYear: {
      type: String,
      description: "Year of start date",
    },
    endDateMonth: {
      type: String,
      description: "Month of end date",
    },
    endDateYear: {
      type: String,
      description: "Year of end date",
    },
    endDateCurrent: {
      type: Boolean,
      description: "Is this job the current job",
      default: false
    },
    notes: {
      type: String,
      description: "Notes about the job",
    },
    content: {
      type: Array,
      items: {
        type: String
      },
      description: "AI generated content"
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      description: "User ID",
    },
    id: {
      type: Number,
      description: "Job ID from the current resume",
    }
  },
  { timestamps: true }
);

const SchoolSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      description: "School ID from the current resume",
    },
    schoolName: {
      type: String,
      description: "School Name",
    },
    fieldOfStudy: {
      type: String,
      description: "Major or field of study",
    },
    city: {
      type: String,
      description: "City of school",
    },
    state: {
      type: String,
      description: "State of school",
    },
    startDateMonth: {
      type: String,
      description: "Month of start date",
    },
    startDateYear: {
      type: String,
      description: "Year of start date",
    },
    endDateMonth: {
      type: String,
      description: "Month of end date",
    },
    endDateYear: {
      type: String,
      description: "Year of end date",
    },
    endDateCurrent: {
      type: Boolean,
      description: "Is this school the current school",
      default: false
    },
    notes: {
      type: String,
      description: "Notes about the users time at school, should be comma separated",
    },
    content: {
      type: Array,
      items: {
        type: String
      },
      description: "AI generated content"
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      description: "User ID",
    },
    id: {
      type: Number,
      description: "School ID from the current resume",
    }
  },
  { timestamps: true }
);

const ResumeSchema = new mongoose.Schema(
  {
    jobs: {
      type: Array,
      items: {
        type: JobSchema
      },
    },
    schools: {
      type: Array,
      items: {
        type: SchoolSchema
      },
    },
    summary: {
      type: String,
      default: ""
    },
    skills: {
      type: Array,
      default: []
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    phone: {
      type: String,
    },
    basics: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
    },
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", ResumeSchema);
export default Resume;