import { writable } from 'svelte/store';
import type { WorkshopParticipant } from '../services/websocket';

export interface PresenceState {
    participants: WorkshopParticipant[];
    isConnected: boolean;
}

const initialState: PresenceState = {
    participants: [],
    isConnected: false,
};

/**
 * Create the presence store
 */
function createPresenceStore() {
    const { subscribe, set, update } = writable<PresenceState>(initialState);

    return {
        subscribe,

        /**
         * Set the full list of participants (with deduplication)
         */
        setParticipants(participants: WorkshopParticipant[]): void {
            // Deduplicate by userId, keeping the last occurrence
            const uniqueMap = new Map<string, WorkshopParticipant>();
            participants.forEach(p => {
                uniqueMap.set(p.userId, p);
            });
            const uniqueParticipants = Array.from(uniqueMap.values());

            update(state => ({
                ...state,
                participants: uniqueParticipants,
            }));
        },

        /**
         * Add or update a participant
         */
        upsertParticipant(participant: WorkshopParticipant): void {
            update(state => {
                const existingIndex = state.participants.findIndex(
                    p => p.userId === participant.userId
                );

                if (existingIndex >= 0) {
                    // Update existing participant
                    const updated = [...state.participants];
                    updated[existingIndex] = {
                        ...updated[existingIndex],
                        ...participant,
                    };
                    return {
                        ...state,
                        participants: updated,
                    };
                } else {
                    // Add new participant
                    return {
                        ...state,
                        participants: [...state.participants, participant],
                    };
                }
            });
        },

        /**
         * Mark a user as joined/online
         */
        userJoined(participant: WorkshopParticipant): void {
            this.upsertParticipant({
                ...participant,
                isOnline: true,
                isActive: true,
            });
        },

        /**
         * Mark a user as left/offline
         */
        userLeft(userId: string): void {
            update(state => ({
                ...state,
                participants: state.participants.map(p =>
                    p.userId === userId
                        ? { ...p, isOnline: false, isActive: false }
                        : p
                ),
            }));
        },

        /**
         * Mark a user as active
         */
        userActive(userId: string): void {
            update(state => ({
                ...state,
                participants: state.participants.map(p =>
                    p.userId === userId ? { ...p, isActive: true } : p
                ),
            }));
        },

        /**
         * Mark a user as idle
         */
        userIdle(userId: string): void {
            update(state => ({
                ...state,
                participants: state.participants.map(p =>
                    p.userId === userId ? { ...p, isActive: false } : p
                ),
            }));
        },

        /**
         * Set connection status
         */
        setConnected(isConnected: boolean): void {
            update(state => ({
                ...state,
                isConnected,
            }));
        },

        /**
         * Get online participants
         */
        getOnlineParticipants(state: PresenceState): WorkshopParticipant[] {
            return state.participants.filter(p => p.isOnline);
        },

        /**
         * Get active participants
         */
        getActiveParticipants(state: PresenceState): WorkshopParticipant[] {
            return state.participants.filter(p => p.isActive);
        },

        /**
         * Reset the store
         */
        reset(): void {
            set(initialState);
        },
    };
}

export const presenceStore = createPresenceStore();
