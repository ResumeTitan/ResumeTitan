import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface WorkshopParticipant {
    userId: string;
    userName: string;
    userEmail: string;
    userAvatar?: string;
    initials: string;
    color: string;
    isOnline: boolean;
    isActive: boolean;
}

export interface JoinWorkshopOptions {
    workshopId: string;
    userId: string;
    userName: string;
    userEmail: string;
    userAvatar?: string;
}

/**
 * Workshop WebSocket client for real-time collaboration
 */
class WorkshopSocketService {
    private socket: Socket | null = null;
    private activityTimeout: ReturnType<typeof setTimeout> | null = null;
    private currentWorkshopId: string | null = null;
    private currentUserId: string | null = null;

    /**
     * Connect to the WebSocket server
     */
    connect(): Socket {
        if (this.socket?.connected) {
            return this.socket;
        }

        this.socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
        });

        this.socket.on('connect', () => {
            console.log('WebSocket connected');
        });

        this.socket.on('disconnect', (reason) => {
            console.log('WebSocket disconnected:', reason);
        });

        this.socket.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        return this.socket;
    }

    /**
     * Join a workshop room
     */
    joinWorkshop(options: JoinWorkshopOptions): void {
        if (!this.socket) {
            this.connect();
        }

        this.currentWorkshopId = options.workshopId;
        this.currentUserId = options.userId;

        this.socket?.emit('join-workshop', {
            workshopId: options.workshopId,
            userId: options.userId,
            userName: options.userName,
            userEmail: options.userEmail,
            userAvatar: options.userAvatar,
        });

        // Start activity tracking
        this.startActivityTracking();
    }

    /**
     * Leave the current workshop room
     */
    leaveWorkshop(): void {
        if (this.currentWorkshopId && this.currentUserId) {
            this.socket?.emit('leave-workshop', {
                workshopId: this.currentWorkshopId,
                userId: this.currentUserId,
            });

            this.currentWorkshopId = null;
            this.currentUserId = null;
            this.stopActivityTracking();
        }
    }

    /**
     * Signal user activity (typing, editing, etc.)
     */
    signalActivity(): void {
        if (!this.currentWorkshopId || !this.currentUserId) return;

        this.socket?.emit('user-activity', {
            workshopId: this.currentWorkshopId,
            userId: this.currentUserId,
        });

        // Reset idle timeout
        this.resetIdleTimeout();
    }

    /**
     * Start tracking user activity and idle status
     */
    private startActivityTracking(): void {
        // Listen for user interactions to signal activity
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];

        events.forEach(event => {
            window.addEventListener(event, this.handleUserActivity);
        });

        // Set initial activity signal
        this.signalActivity();
    }

    /**
     * Stop tracking user activity
     */
    private stopActivityTracking(): void {
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];

        events.forEach(event => {
            window.removeEventListener(event, this.handleUserActivity);
        });

        if (this.activityTimeout) {
            clearTimeout(this.activityTimeout);
            this.activityTimeout = null;
        }
    }

    /**
     * Handle user activity events
     */
    private handleUserActivity = (): void => {
        this.signalActivity();
    };

    /**
     * Reset the idle timeout (user goes idle after 30 seconds of no activity)
     */
    private resetIdleTimeout(): void {
        if (this.activityTimeout) {
            clearTimeout(this.activityTimeout);
        }

        this.activityTimeout = setTimeout(() => {
            if (this.currentWorkshopId && this.currentUserId) {
                this.socket?.emit('user-idle', {
                    workshopId: this.currentWorkshopId,
                    userId: this.currentUserId,
                });
            }
        }, 30000); // 30 seconds
    }

    /**
     * Subscribe to workshop events
     */
    on(event: string, callback: (...args: any[]) => void): void {
        this.socket?.on(event, callback);
    }

    /**
     * Unsubscribe from workshop events
     */
    off(event: string, callback?: (...args: any[]) => void): void {
        if (callback) {
            this.socket?.off(event, callback);
        } else {
            this.socket?.off(event);
        }
    }

    /**
     * Disconnect from the WebSocket server
     */
    disconnect(): void {
        this.leaveWorkshop();
        this.socket?.disconnect();
        this.socket = null;
    }

    /**
     * Check if currently connected
     */
    isConnected(): boolean {
        return this.socket?.connected || false;
    }

    /**
     * Get the current socket instance
     */
    getSocket(): Socket | null {
        return this.socket;
    }
}

// Export a singleton instance
export const workshopSocket = new WorkshopSocketService();
