import { Server, Socket } from 'socket.io';
import Workshop from '../models/Workshop';
import * as Sentry from '@sentry/node';

interface JoinWorkshopData {
    workshopId: string;
    userId: string;
    userName: string;
    userEmail: string;
    userAvatar?: string;
}

interface ActivityData {
    workshopId: string;
    userId: string;
}

interface LeaveWorkshopData {
    workshopId: string;
    userId: string;
}

// Track active connections per workshop
const workshopConnections = new Map<string, Map<string, string>>(); // workshopId -> userId -> socketId

/**
 * Get a random color for user presence indicators
 */
function getRandomColor(): string {
    const colors = [
        '#3B82F6', // blue
        '#EF4444', // red
        '#10B981', // green
        '#F59E0B', // amber
        '#8B5CF6', // purple
        '#EC4899', // pink
        '#06B6D4', // cyan
        '#F97316', // orange
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Generate initials from a name
 */
function getInitials(name: string): string {
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Set up workshop socket event handlers
 */
export function setupWorkshopSockets(io: Server): void {
    io.on('connection', (socket: Socket) => {
        console.log(`Socket connected: ${socket.id}`);

        /**
         * User joins a workshop room
         */
        socket.on('join-workshop', async (data: JoinWorkshopData) => {
            try {
                const { workshopId, userId, userName, userEmail, userAvatar } = data;

                // Join the workshop room
                socket.join(workshopId);

                // Track this connection
                if (!workshopConnections.has(workshopId)) {
                    workshopConnections.set(workshopId, new Map());
                }
                workshopConnections.get(workshopId)!.set(userId, socket.id);

                // Find or create participant in the workshop
                const workshop = await Workshop.findById(workshopId);
                if (!workshop) {
                    socket.emit('error', { message: 'Workshop not found' });
                    return;
                }

                // Check if user is already a participant (handle duplicates)
                const existingParticipants = workshop.participants.filter((p: any) => p.clerkId === userId);
                let participant;

                if (existingParticipants.length === 0) {
                    // Add new participant
                    const initials = getInitials(userName);
                    const color = getRandomColor();

                    workshop.participants.push({
                        clerkId: userId,
                        name: userName,
                        email: userEmail,
                        avatar: userAvatar || '',
                        initials,
                        color,
                        isOnline: true,
                        isActive: true,
                        joinedAt: new Date(),
                    });
                    await workshop.save();

                    participant = workshop.participants[workshop.participants.length - 1];
                } else {
                    // If there are duplicates, remove all but the first one
                    if (existingParticipants.length > 1) {
                        console.warn(`Found ${existingParticipants.length} duplicate participants for user ${userId} in workshop ${workshopId}`);
                        // Keep only the first occurrence, remove duplicates
                        const firstParticipant = existingParticipants[0];
                        workshop.participants = workshop.participants.filter((p: any) => {
                            return p.clerkId !== userId || p === firstParticipant;
                        });
                    }

                    // Update existing participant status
                    participant = workshop.participants.find((p: any) => p.clerkId === userId);
                    if (participant) {
                        participant.isOnline = true;
                        participant.isActive = true;
                    }
                    await workshop.save();
                }

                // Broadcast to other users in the room that this user joined
                socket.to(workshopId).emit('user-joined', {
                    userId,
                    userName,
                    userEmail,
                    userAvatar,
                    initials: participant.initials,
                    color: participant.color,
                    isOnline: true,
                    isActive: true,
                });

                // Send current participants list to the joining user
                socket.emit('participants-list', {
                    participants: workshop.participants.map((p: any) => ({
                        userId: p.clerkId,
                        userName: p.name,
                        userEmail: p.email,
                        userAvatar: p.avatar,
                        initials: p.initials,
                        color: p.color,
                        isOnline: p.isOnline,
                        isActive: p.isActive,
                    })),
                });
            } catch (error) {
                console.error('Error joining workshop:', error);
                Sentry.captureException(error);
                socket.emit('error', { message: 'Failed to join workshop' });
            }
        });

        /**
         * User indicates activity (typing, editing, etc.)
         */
        socket.on('user-activity', async (data: ActivityData) => {
            try {
                const { workshopId, userId } = data;

                // Update participant active status
                const workshop = await Workshop.findById(workshopId);
                if (workshop) {
                    const participant = workshop.participants.find((p: any) => p.clerkId === userId);
                    if (participant && !participant.isActive) {
                        participant.isActive = true;
                        await workshop.save();

                        // Broadcast activity update
                        socket.to(workshopId).emit('user-active', { userId });
                    }
                }
            } catch (error) {
                console.error('Error updating user activity:', error);
                Sentry.captureException(error);
            }
        });

        /**
         * User goes idle (no activity for a while)
         */
        socket.on('user-idle', async (data: ActivityData) => {
            try {
                const { workshopId, userId } = data;

                // Update participant idle status
                const workshop = await Workshop.findById(workshopId);
                if (workshop) {
                    const participant = workshop.participants.find((p: any) => p.clerkId === userId);
                    if (participant && participant.isActive) {
                        participant.isActive = false;
                        await workshop.save();

                        // Broadcast idle update
                        socket.to(workshopId).emit('user-idle', { userId });
                    }
                }
            } catch (error) {
                console.error('Error updating user idle status:', error);
                Sentry.captureException(error);
            }
        });

        /**
         * User explicitly leaves a workshop
         */
        socket.on('leave-workshop', async (data: LeaveWorkshopData) => {
            try {
                const { workshopId, userId } = data;

                // Leave the room
                socket.leave(workshopId);

                // Remove from connection tracking
                if (workshopConnections.has(workshopId)) {
                    workshopConnections.get(workshopId)!.delete(userId);
                }

                // Update participant status
                const workshop = await Workshop.findById(workshopId);
                if (workshop) {
                    const participant = workshop.participants.find((p: any) => p.clerkId === userId);
                    if (participant) {
                        participant.isOnline = false;
                        participant.isActive = false;
                        await workshop.save();

                        // Broadcast to room that user left
                        socket.to(workshopId).emit('user-left', { userId });
                    }
                }

                console.log(`User ${userId} left workshop ${workshopId}`);
            } catch (error) {
                console.error('Error leaving workshop:', error);
                Sentry.captureException(error);
            }
        });

        /**
         * Handle socket disconnection
         */
        socket.on('disconnect', async () => {
            console.log(`Socket disconnected: ${socket.id}`);

            // Find which workshops this socket was in and mark user as offline
            for (const [workshopId, userMap] of workshopConnections.entries()) {
                for (const [userId, socketId] of userMap.entries()) {
                    if (socketId === socket.id) {
                        try {
                            // Update participant status
                            const workshop = await Workshop.findById(workshopId);
                            if (workshop) {
                                const participant = workshop.participants.find((p: any) => p.clerkId === userId);
                                if (participant) {
                                    participant.isOnline = false;
                                    participant.isActive = false;
                                    await workshop.save();

                                    // Broadcast to room that user disconnected
                                    io.to(workshopId).emit('user-left', { userId });
                                }
                            }

                            // Remove from tracking
                            userMap.delete(userId);
                        } catch (error) {
                            console.error('Error handling disconnect:', error);
                            Sentry.captureException(error);
                        }
                    }
                }
            }
        });
    });
}
