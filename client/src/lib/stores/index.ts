/**
 * Stores Index
 *
 * Barrel export for all Svelte stores.
 */

export { authStore, isAuthenticated, isDarkMode } from './auth';
export type { AuthState } from './auth';

export {
	resumeStore,
	resumeBasics,
	resumeWork,
	resumeEducation,
	resumeSkills,
	resumeProjects,
	resumeVolunteer,
	resumeTheme,
	resumeFont,
	resumeSections
} from './resume';

export { uiStore, isLoading, hasActiveModal, toasts } from './ui';
export type { UIState, Toast } from './ui';
