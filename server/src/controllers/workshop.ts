/**
 * Workshop Controller
 *
 * Handles collaborative resume editing sessions. Workshops allow multiple users
 * to view a resume and leave comments. Only the owner can edit; others can comment.
 */

import { Response, Request } from 'express';
import Workshop from '../models/Workshop';
import Resume from '../models/Resume';
import { randomUUID } from 'crypto';
import 'dotenv/config';

/** Assigns a random avatar color from a predefined palette. */
function generateUserColor(): string {
    const colors = ['#115E59', '#7C3AED', '#DC2626', '#2563EB', '#059669', '#D97706', '#7C2D12', '#4338CA'];
    return colors[Math.floor(Math.random() * colors.length)];
}

/** Extracts up to 2 initials from a name (e.g., "John Doe" -> "JD"). */
function getInitials(name: string): string {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

/**
 * Finds a workshop that the user can access (as owner or participant).
 * @returns Object with workshop and isOwner flag, or null if not found/accessible.
 */
async function findAccessibleWorkshop(workshopId: string, clerkId: string): Promise<{ workshop: any; isOwner: boolean } | null> {
    // First try to find as owner
    let workshop = await Workshop.findOne({ _id: workshopId, clerkId });
    if (workshop) {
        return { workshop, isOwner: true };
    }

    // Check if user has shared access
    workshop = await Workshop.findOne({
        _id: workshopId,
        shareEnabled: true,
        'participants.clerkId': clerkId,
    });

    if (workshop) {
        return { workshop, isOwner: false };
    }

    return null;
}

/** Retrieves all workshops the user owns or has been invited to. */
export const getWorkshops = async (req: Request, res: Response) => {
    // @ts-ignore
    const clerkId = req.auth?.userId;
    try {
        if (!clerkId) {
            return res.status(401).json({ msg: 'User not authenticated' });
        }

        // Get workshops owned by user
        const owned = await Workshop.find({ clerkId }).sort({ updatedAt: -1 });

        // Get workshops shared with user (where user is a participant but not owner)
        const shared = await Workshop.find({
            'participants.clerkId': clerkId,
            clerkId: { $ne: clerkId },
            shareEnabled: true,
        }).sort({ updatedAt: -1 });

        res.status(200).json({ owned, shared });
    } catch (err: any) {
        res.status(500).json({ msg: err.message });
    }
};

/** Retrieves a workshop by ID. Returns role info (owner vs commenter). */
export const getWorkshop = async (req: Request, res: Response) => {
    const id = req.params.id;
    // @ts-ignore
    const clerkId = req.auth?.userId;

    try {
        if (!clerkId) {
            return res.status(401).json({ msg: 'User not authenticated' });
        }

        const result = await findAccessibleWorkshop(id, clerkId);

        if (!result) {
            return res.status(404).json({ msg: 'Workshop not found' });
        }

        res.status(200).json({
            workshop: result.workshop,
            role: result.isOwner ? 'owner' : 'commenter',
            canEdit: result.isOwner,
        });
    } catch (err: any) {
        console.error('Error getting workshop:', err);
        res.status(500).json({ msg: err.message });
    }
};

/**
 * Retrieves a workshop via its share token. Adds the user as a participant
 * if not already present. Redirects owners to the main workshop page.
 */
export const getWorkshopByShareToken = async (req: Request, res: Response) => {
    const { token } = req.params;
    // @ts-ignore
    const clerkId = req.auth?.userId;
    const { userName, userEmail } = req.query;

    try {
        if (!clerkId) {
            return res.status(401).json({ msg: 'User not authenticated' });
        }

        const workshop = await Workshop.findOne({ shareToken: token, shareEnabled: true });

        if (!workshop) {
            return res.status(404).json({ msg: 'Workshop not found or sharing is disabled' });
        }

        const isOwner = workshop.clerkId === clerkId;

        // If owner accesses via share link, redirect them to the main workshop page
        if (isOwner) {
            return res.status(200).json({
                redirectToWorkshop: true,
                workshopId: workshop._id,
            });
        }

        // Add user to participants if not already there (never add owner)
        const existingParticipant = workshop.participants.find((p: any) => p.clerkId === clerkId);

        if (!existingParticipant) {
            workshop.participants.push({
                clerkId,
                name: userName || 'Anonymous',
                email: userEmail || '',
                initials: getInitials(String(userName) || 'A'),
                color: generateUserColor(),
                isOnline: true,
                isActive: false,
                joinedAt: new Date(),
            });
            await workshop.save();
        }

        // Get the resume (read-only for non-owners)
        const resume = await Resume.findById(workshop.resumeId);

        res.status(200).json({
            workshop,
            resume,
            role: 'commenter',
            canEdit: false,
        });
    } catch (err: any) {
        console.error('Error getting shared workshop:', err);
        res.status(500).json({ msg: err.message });
    }
};

/** Enables or disables sharing for a workshop. Generates a share token if needed. */
export const toggleWorkshopSharing = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { enabled } = req.body;
    // @ts-ignore
    const clerkId = req.auth?.userId;

    try {
        if (!clerkId) {
            return res.status(401).json({ msg: 'User not authenticated' });
        }

        const workshop = await Workshop.findOne({ _id: id, clerkId });

        if (!workshop) {
            return res.status(404).json({ msg: "Workshop not found or you don't have permission" });
        }

        workshop.shareEnabled = enabled;

        // Generate token if enabling and none exists
        if (enabled && !workshop.shareToken) {
            workshop.shareToken = randomUUID();
        }

        await workshop.save();

        res.status(200).json({
            workshop,
            shareUrl: enabled ? `/workshop/shared/${workshop.shareToken}` : null,
        });
    } catch (err: any) {
        console.error('Error toggling share:', err);
        res.status(500).json({ msg: err.message });
    }
};

/** Updates workshop metadata (currently only name). Owner only. */
export const updateWorkshop = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { name } = req.body;
    // @ts-ignore
    const clerkId = req.auth?.userId;

    try {
        if (!clerkId) {
            return res.status(401).json({ msg: 'User not authenticated' });
        }

        const workshop = await Workshop.findOne({ _id: id, clerkId });

        if (!workshop) {
            return res.status(404).json({ msg: "Workshop not found or you don't have permission" });
        }

        // Update allowed fields
        if (name !== undefined) {
            workshop.name = name;
        }

        await workshop.save();

        res.status(200).json({ workshop });
    } catch (err: any) {
        console.error('Error updating workshop:', err);
        res.status(500).json({ msg: err.message });
    }
};

/** Deletes a workshop. Owner only. */
export const deleteWorkshop = async (req: Request, res: Response) => {
    const id = req.params.id;
    // @ts-ignore
    const clerkId = req.auth?.userId;

    try {
        if (!clerkId) {
            return res.status(401).json({ msg: 'User not authenticated' });
        }

        const workshop = await Workshop.findOneAndDelete({ _id: id, clerkId });

        if (!workshop) {
            return res.status(404).json({ msg: "Workshop not found or you don't have permission" });
        }

        res.status(200).json({ workshop });
    } catch (err: any) {
        res.status(500).json({ msg: err.message });
    }
};

/** Creates a new workshop linked to an existing resume. Owner is auto-added as participant. */
export const createWorkshop = async (req: Request, res: Response) => {
    const { resumeId, name, ownerName, ownerEmail } = req.body;
    // @ts-ignore
    const clerkId = req.auth?.userId;

    try {
        if (!clerkId) {
            return res.status(401).json({ msg: 'User not authenticated' });
        }

        if (!resumeId) {
            return res.status(400).json({ msg: 'resumeId is required' });
        }

        const resume = await Resume.findOne({ _id: resumeId, clerkId });
        if (!resume) {
            return res.status(404).json({ msg: 'Resume not found' });
        }

        const workshopName = typeof name === 'string' && name.trim() ? name.trim() : resume.name || 'Workshop';

        const workshop = await Workshop.create({
            name: workshopName,
            clerkId,
            ownerName: ownerName || 'Owner',
            ownerEmail: ownerEmail || '',
            resumeId,
            participants: [
                {
                    clerkId,
                    name: ownerName || 'Owner',
                    email: ownerEmail || '',
                    initials: getInitials(ownerName || 'Owner'),
                    color: '#115E59',
                    isOnline: true,
                    isActive: true,
                    joinedAt: new Date(),
                },
            ],
        });

        console.log('Created workshop', workshop);
        res.status(200).json({ workshop });
    } catch (err: any) {
        res.status(500).json({ msg: err.message });
    }
};

/** Adds a new top-level comment to a workshop. Available to owners and participants. */
export const addComment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { text, section, authorName, authorEmail } = req.body;
    // @ts-ignore
    const clerkId = req.auth?.userId;

    try {
        if (!clerkId) {
            return res.status(401).json({ msg: 'User not authenticated' });
        }

        const result = await findAccessibleWorkshop(id, clerkId);

        if (!result) {
            return res.status(404).json({ msg: 'Workshop not found or access denied' });
        }

        const { workshop } = result;

        // Find participant info for color/initials
        const participant = workshop.participants.find((p: any) => p.clerkId === clerkId);

        const newComment = {
            id: randomUUID(),
            authorClerkId: clerkId,
            authorName: authorName || participant?.name || 'Anonymous',
            authorEmail: authorEmail || participant?.email || '',
            authorInitials: participant?.initials || getInitials(authorName || 'A'),
            authorColor: participant?.color || generateUserColor(),
            text,
            section: section || '',
            timestamp: new Date(),
            resolved: false,
            replies: [],
        };

        workshop.comments.unshift(newComment);
        await workshop.save();

        res.status(200).json({ comment: newComment });
    } catch (err: any) {
        console.error('Error adding comment:', err);
        res.status(500).json({ msg: err.message });
    }
};

/** Adds a reply to an existing comment. */
export const replyToComment = async (req: Request, res: Response) => {
    const { id, commentId } = req.params;
    const { text, authorName, authorEmail } = req.body;
    // @ts-ignore
    const clerkId = req.auth?.userId;

    try {
        if (!clerkId) {
            return res.status(401).json({ msg: 'User not authenticated' });
        }

        const result = await findAccessibleWorkshop(id, clerkId);

        if (!result) {
            return res.status(404).json({ msg: 'Workshop not found or access denied' });
        }

        const { workshop } = result;
        const comment = workshop.comments.find((c: any) => c.id === commentId);

        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        const participant = workshop.participants.find((p: any) => p.clerkId === clerkId);

        const reply = {
            id: randomUUID(),
            authorClerkId: clerkId,
            authorName: authorName || participant?.name || 'Anonymous',
            authorEmail: authorEmail || participant?.email || '',
            authorInitials: participant?.initials || getInitials(authorName || 'A'),
            authorColor: participant?.color || generateUserColor(),
            text,
            timestamp: new Date(),
            resolved: false,
            replies: [],
        };

        comment.replies.push(reply);
        await workshop.save();

        res.status(200).json({ reply });
    } catch (err: any) {
        console.error('Error replying to comment:', err);
        res.status(500).json({ msg: err.message });
    }
};

/** Marks a comment as resolved or unresolved. Only owner or comment author can do this. */
export const resolveComment = async (req: Request, res: Response) => {
    const { id, commentId } = req.params;
    const { resolved } = req.body;
    // @ts-ignore
    const clerkId = req.auth?.userId;

    try {
        if (!clerkId) {
            return res.status(401).json({ msg: 'User not authenticated' });
        }

        const workshop = await Workshop.findById(id);

        if (!workshop) {
            return res.status(404).json({ msg: 'Workshop not found' });
        }

        const isOwner = workshop.clerkId === clerkId;
        const comment = workshop.comments.find((c: any) => c.id === commentId);

        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        // Only owner or comment author can resolve
        if (!isOwner && comment.authorClerkId !== clerkId) {
            return res.status(403).json({ msg: 'Only the owner or comment author can resolve comments' });
        }

        comment.resolved = resolved;
        comment.resolvedBy = resolved ? clerkId : undefined;
        await workshop.save();

        res.status(200).json({ comment });
    } catch (err: any) {
        console.error('Error resolving comment:', err);
        res.status(500).json({ msg: err.message });
    }
};
