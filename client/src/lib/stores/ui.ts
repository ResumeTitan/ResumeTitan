/**
 * UI Store
 *
 * Manages global UI state like modals, loading states, and notifications.
 */

import { writable, derived } from 'svelte/store';
import type { AlertVariant } from '$types';

export interface Toast {
    id: string;
    message: string;
    variant: AlertVariant;
    duration?: number;
}

export interface UIState {
    isLoading: boolean;
    loadingMessage: string;
    isMobileMenuOpen: boolean;
    activeModal: string | null;
    toasts: Toast[];
}

const defaultState: UIState = {
    isLoading: false,
    loadingMessage: '',
    isMobileMenuOpen: false,
    activeModal: null,
    toasts: [],
};

function createUIStore() {
    const { subscribe, set, update } = writable<UIState>(defaultState);

    return {
        subscribe,

        /**
         * Show global loading state
         */
        showLoading: (message = 'Loading...') =>
            update(state => ({
                ...state,
                isLoading: true,
                loadingMessage: message,
            })),

        /**
         * Hide global loading state
         */
        hideLoading: () =>
            update(state => ({
                ...state,
                isLoading: false,
                loadingMessage: '',
            })),

        /**
         * Toggle mobile menu
         */
        toggleMobileMenu: () =>
            update(state => ({
                ...state,
                isMobileMenuOpen: !state.isMobileMenuOpen,
            })),

        /**
         * Close mobile menu
         */
        closeMobileMenu: () =>
            update(state => ({
                ...state,
                isMobileMenuOpen: false,
            })),

        /**
         * Open a modal by name
         */
        openModal: (modalName: string) =>
            update(state => ({
                ...state,
                activeModal: modalName,
            })),

        /**
         * Close the active modal
         */
        closeModal: () =>
            update(state => ({
                ...state,
                activeModal: null,
            })),

        /**
         * Show a toast notification
         */
        showToast: (message: string, variant: AlertVariant = 'info', duration = 5000) => {
            const id = crypto.randomUUID();

            update(state => ({
                ...state,
                toasts: [...state.toasts, { id, message, variant, duration }],
            }));

            // Auto-remove after duration
            if (duration > 0) {
                setTimeout(() => {
                    update(state => ({
                        ...state,
                        toasts: state.toasts.filter(t => t.id !== id),
                    }));
                }, duration);
            }

            return id;
        },

        /**
         * Remove a specific toast
         */
        removeToast: (id: string) =>
            update(state => ({
                ...state,
                toasts: state.toasts.filter(t => t.id !== id),
            })),

        /**
         * Clear all toasts
         */
        clearToasts: () =>
            update(state => ({
                ...state,
                toasts: [],
            })),

        /**
         * Convenience: Show success toast
         */
        success: (message: string, duration = 5000) => {
            const store = createUIStore();
            return store.showToast(message, 'success', duration);
        },

        /**
         * Convenience: Show error toast
         */
        error: (message: string, duration = 7000) => {
            const store = createUIStore();
            return store.showToast(message, 'error', duration);
        },

        /**
         * Reset to default state
         */
        reset: () => set(defaultState),
    };
}

export const uiStore = createUIStore();

// Derived stores for common checks
export const isLoading = derived(uiStore, $ui => $ui.isLoading);
export const hasActiveModal = derived(uiStore, $ui => $ui.activeModal !== null);
export const toasts = derived(uiStore, $ui => $ui.toasts);
