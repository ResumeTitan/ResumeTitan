import mongoose from "mongoose";

/**
 * Build out resume schema from JSON Resume
 * https://jsonresume.org/schema/
 */

const BasicsSchema = new mongoose.Schema({
  name: { type: String, required: true, default: '' },
  label: { type: String, required: true, default: '' },
  image: { type: String, required: false, default: '' },
  email: { type: String, required: true, default: '' },
  phone: { type: String, required: false, default: '' },
  url: { type: String, required: false, default: '' },
  summary: { type: String, required: false, default: '' },
  location: {
    address: { type: String, required: true, default: '' },
    postalCode: { type: String, required: true, default: '' },
    city: { type: String, required: true, default: '' },
    countryCode: { type: String, required: true, default: '' },
    region: { type: String, required: false, default: '' },
  },
  profiles: [
    {
      network: { type: String, required: true, default: '' },
      username: { type: String, required: true, default: '' },
      url: { type: String, required: false, default: '' },
    },
  ],
}
)

const WorkSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      default: 0,
      description: "Job ID from the current resume",
    },
    position: {
      type: String,
      description: "Job title",
    },
    name: {
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
    highlights: {
      type: Array,
      items: {
        type: String
      },
      description: "AI generated content"
    },
  }
);

const SkillsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      description: "name of the skill"
    },
    level: {
      type: String,
      description: "Level of experience in that skill"
    },
    keywords: {
      type: Array,
      items: {
        type: String
      },
      description: "Other keywords for the skill"
    }
  }
)

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
      default: []
    },
    education: {
      type: Array,
      items: {
        type: EducationSchema
      },
      default: []
    },
    summary: {
      type: String,
      default: ""
    },
    skills: {
      type: Array,
      items: {
        type: SkillsSchema
      },
      default: []
    },
    theme: {
      type: String,
      description: "Theme of the resume selected by the user",
      default: "professional"
    },
    clerkId: {
      type: String,
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