import mongoose from "mongoose";

/**
 * Build out resume schema from JSON Resume
 * https://jsonresume.org/schema/
 */

const BasicsSchema = new mongoose.Schema({
  name: { type: String, required: false, default: '' },
  label: { type: String, required: false, default: '' },
  image: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  phone: { type: String, required: false, default: '' },
  url: { type: String, required: false, default: '' },
  summary: { type: String, required: false, default: '' },
  location: {
    address: { type: String, required: false, default: '' },
    postalCode: { type: String, required: false, default: '' },
    city: { type: String, required: false, default: '' },
    countryCode: { type: String, required: false, default: '' },
    region: { type: String, required: false, default: '' },
  },
  profiles: {
    type: Array,
    items: {
      network: { type: String, required: false, default: '' },
      username: { type: String, required: false, default: '' },
      url: { type: String, required: false, default: '' },
    },
    default: []
  }
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

const AwardsSchema = new mongoose.Schema({
  title: {
    type: String,
    description: "Title of the award"
  },
  awarder: {
    type: String,
    description: "Who gave the award"
  },
  summary: {
    type: String,
    description: "Description of the award"
  }
})

const EducationSchema = new mongoose.Schema({
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
});

const VolunteerSchema = new mongoose.Schema({
  id: {
    type: Number,
    description: "School ID from the current resume",
  },
  organization: {
    type: String,
    description: "Name of the organization",
  },
  position: {
    type: String,
    description: "Position name",
  },
  url: {
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
    description: "Highlights with AI generated content"
  },
});

const SkillsSchema = new mongoose.Schema({
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
});

const ResumeSchema = new mongoose.Schema({
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
  volunteer: {
    type: Array,
    items: {
      type: VolunteerSchema
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
  awards: {
    type: Array,
    items: {
      type: AwardsSchema
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
  sections: {
    type: Array,
    items: {
      type: String
    },
    description: "Order of sections to show on resume",
    default: ["Basics"]
  }
}, { timestamps: true });

const Resume = mongoose.model("Resume", ResumeSchema);
export default Resume;