import mongoose from "mongoose";
import { randomUUID } from 'crypto';

const WorkshopUserSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      description: "Clerk user id",
    },
    name: {
      type: String,
      description: "Display name of the participant",
    },
    email: {
      type: String,
      description: "User email",
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
    joinedAt: {
      type: Date,
      description: "When the user joined the workshop",
      default: Date.now,
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
    authorClerkId: {
      type: String,
      description: "Clerk ID of the comment author",
    },
    authorName: {
      type: String,
      description: "Display name of the author",
    },
    authorEmail: {
      type: String,
      description: "Email of the author",
    },
    authorInitials: {
      type: String,
      description: "Initials of the author",
    },
    authorColor: {
      type: String,
      description: "Color assigned to the author",
    },
    text: {
      type: String,
      description: "Comment text",
    },
    timestamp: {
      type: Date,
      description: "When the comment was created",
      default: Date.now,
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
    resolvedBy: {
      type: String,
      description: "Clerk ID of user who resolved",
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
      description: "The clerk id of the user who owns the workshop",
    },
    ownerName: {
      type: String,
      description: "Display name of the owner",
    },
    ownerEmail: {
      type: String,
      description: "Email of the owner",
    },
    resumeId: {
      type: String,
      ref: "Resume",
      description: "Resume tied to this workshop",
    },
    name: {
      type: String,
      description: "Name of the workshop",
      default: "Workshop",
    },
    // Sharing fields
    shareToken: {
      type: String,
      description: "Unique token for sharing",
      unique: true,
      sparse: true,
    },
    shareEnabled: {
      type: Boolean,
      description: "Whether sharing is enabled",
      default: false,
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

// Generate share token before saving if enabled but no token exists
WorkshopSchema.pre('save', function(next) {
  if (this.shareEnabled && !this.shareToken) {
    this.shareToken = randomUUID();
  }
  next();
});

const Workshop = mongoose.model("Workshop", WorkshopSchema);
export default Workshop;