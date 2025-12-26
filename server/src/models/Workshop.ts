import mongoose from "mongoose";

const WorkshopUserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      description: "User id for workshop participants",
    },
    name: {
      type: String,
      description: "Display name of the participant",
    },
    avatar: {
      type: String,
      description: "Optional avatar url",
    },
    initials: {
      type: String,
      description: "Short initials for display",
    },
    color: {
      type: String,
      description: "Accent color for user presence",
    },
    isOnline: {
      type: Boolean,
      description: "Whether the user is online",
      default: false,
    },
    isActive: {
      type: Boolean,
      description: "Whether the user is currently active",
      default: false,
    },
  },
  { _id: false }
);

const WorkshopCommentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      description: "Unique id for the comment",
    },
    author: {
      type: WorkshopUserSchema,
      description: "Author of the comment",
    },
    text: {
      type: String,
      description: "Comment text",
    },
    timestamp: {
      type: Date,
      description: "When the comment was created",
    },
    section: {
      type: String,
      description: "Optional resume section reference",
    },
    resolved: {
      type: Boolean,
      description: "Whether the comment is resolved",
      default: false,
    },
    replies: {
      type: Array,
      description: "Replies to the comment",
      default: [],
    },
  },
  { _id: false }
);

const WorkshopSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      // required: true,
      description: "The clerk id of the user who owns the workshop",
    },
    resumeId: {
      type: String,
      ref: "Resume",
      // required: true,
      description: "Resume tied to this workshop",
    },
    name: {
      type: String,
      description: "Name of the workshop",
      default: "Workshop",
    },
    participants: {
      type: [WorkshopUserSchema],
      description: "Users participating in the workshop",
      default: [],
    },
    comments: {
      type: [WorkshopCommentSchema],
      description: "Comment threads for the workshop",
      default: [],
    },
  },
  { timestamps: true }
);

const Workshop = mongoose.model("Workshop", WorkshopSchema);
export default Workshop;
