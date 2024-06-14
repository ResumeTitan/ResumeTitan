import mongoose from "mongoose";

/**
 * Build out resume schema from JSON Resume
 * https://jsonresume.org/schema/
 */

const BasicsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      description: "Name of the user",
    },
    label: {
      type: String,
      description: "Label of the user",
    },
    image: {
      type: String,
      description: "Image of the user",
    },
    email: {
      type: String,
      description: "Email of the user",
    },
    phone: {
      type: String,
      description: "Phone number of the user",
    },
    url: {
      type: String,
      description: "URL of the user",
    },
    summary: {
      type: String,
      description: "Summary of the user",
    },
    location: {
      type: String,
      description: "Location of the user",
    },
  }
)

const WorkSchema = new mongoose.Schema(
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
    startDate: {
      type: String,
      description: "Start date",
    },
    endDate: {
      type: String,
      description: "End date",
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
    highlights: {
      type: Array,
      items: {
        type: String
      },
      description: "AI generated content"
    },
  }
);

const EducationSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      description: "School ID from the current resume",
    },
    institution: {
      type: String,
      description: "Name of the institution",
    },
    area: {
      type: String,
      description: "Area of study",
    },
    studyType: {
      type: String,
      description: "Type of degree",
    },
    startDate: {
      type: String,
      description: "Start date",
    },
    endDate: {
      type: String,
      description: "End date",
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
  }
);

const ResumeSchema = new mongoose.Schema(
  {
    basics: {
      type: BasicsSchema,
      required: true,
    },
    work: {
      type: Array,
      items: {
        type: WorkSchema
      },
    },
    education: {
      type: Array,
      items: {
        type: EducationSchema
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
    theme: {
      type: String,
      description: "Theme of the resume selected by the user",
      default: "default"
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      default: "Resume Name",
    },
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", ResumeSchema);
export default Resume;