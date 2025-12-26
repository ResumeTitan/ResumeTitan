/**
 * Auth Store
 *
 * Replaces Redux authReducer with a simpler Svelte store.
 * Handles user authentication state and theme mode.
 */

import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export interface UserInfo {
	id: string;
	fullName?: string;
	email?: string;
}

export interface AuthState {
	mode: 'light' | 'dark';
	userId: string;
	token: string;
	user: UserInfo | null;
	showAuthModal: boolean;
}

const STORAGE_KEY = 'resumetitan-auth';

const defaultState: AuthState = {
	mode: 'dark',
	userId: '',
	token: '',
	user: null,
	showAuthModal: false
};

function loadFromStorage(): AuthState {
	if (!browser) return defaultState;

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			return { ...defaultState, ...JSON.parse(stored) };
		}
	} catch (e) {
		console.error('Failed to load auth state from storage:', e);
	}

	return defaultState;
}

function saveToStorage(state: AuthState): void {
	if (!browser) return;

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch (e) {
		console.error('Failed to save auth state to storage:', e);
	}
}

function createAuthStore() {
	const initial = loadFromStorage();
	const { subscribe, set, update } = writable<AuthState>(initial);

	// Subscribe to changes and persist to storage
	subscribe((state) => {
		saveToStorage(state);
	});

	return {
		subscribe,

		/**
		 * Toggle between light and dark mode
		 */
		toggleMode: () =>
			update((state) => ({
				...state,
				mode: state.mode === 'light' ? 'dark' : 'light'
			})),

		/**
		 * Set the theme mode
		 */
		setMode: (mode: 'light' | 'dark') =>
			update((state) => ({ ...state, mode })),

		/**
		 * Set the user ID
		 */
		setUserId: (userId: string) =>
			update((state) => ({ ...state, userId })),

		/**
		 * Set the auth token
		 */
		setToken: (token: string) =>
			update((state) => ({ ...state, token })),

		/**
		 * Set both user ID and token (common on login)
		 */
		setAuth: (userId: string, token: string) =>
			update((state) => ({ ...state, userId, token })),

		/**
		 * Set the user info
		 */
		setUser: (user: UserInfo | null) =>
			update((state) => ({ ...state, user, userId: user?.id || '' })),

		/**
		 * Clear auth state (logout)
		 */
		logout: () => {
			set(defaultState);
			if (browser) {
				localStorage.removeItem(STORAGE_KEY);
			}
		},

		/**
		 * Clear authentication data without resetting other preferences
		 */
		clearAuth: () =>
			update((state) => ({
				...state,
				userId: '',
				token: '',
				user: null
			})),

		/**
		 * Reset to default state
		 */
		reset: () => set(defaultState),

		/**
		 * Open the auth modal
		 */
		openAuthModal: () =>
			update((state) => ({ ...state, showAuthModal: true })),

		/**
		 * Close the auth modal
		 */
		closeAuthModal: () =>
			update((state) => ({ ...state, showAuthModal: false }))
	};
}

export const authStore = createAuthStore();

// Derived stores for common checks
export const isAuthenticated = derived(authStore, ($auth) => !!$auth.token && !!$auth.userId);

export const isDarkMode = derived(authStore, ($auth) => $auth.mode === 'dark');

export const showAuthModal = derived(authStore, ($auth) => $auth.showAuthModal);
