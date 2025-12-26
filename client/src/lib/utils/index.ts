/**
 * Utils Index
 *
 * Barrel export for all utility functions.
 */

export * from './dateUtils';
export * from './fontUtils';

/**
 * Check if an object is empty (has no own properties)
 */
export function isObjectEmpty(obj: Record<string, unknown> | null | undefined): boolean {
	if (!obj) return true;
	return Object.keys(obj).length === 0;
}

/**
 * Swap two elements in an array (for drag-and-drop reordering)
 * Returns a new array with the elements swapped
 */
export function swapArrayElements<T>(array: T[], index1: number, index2: number): T[] {
	if (index1 < 0 || index2 < 0 || index1 >= array.length || index2 >= array.length) {
		return array;
	}

	const result = [...array];
	[result[index1], result[index2]] = [result[index2], result[index1]];
	return result;
}

/**
 * Move an element from one index to another
 * Returns a new array with the element moved
 */
export function moveArrayElement<T>(array: T[], fromIndex: number, toIndex: number): T[] {
	if (fromIndex < 0 || toIndex < 0 || fromIndex >= array.length || toIndex >= array.length) {
		return array;
	}

	const result = [...array];
	const [element] = result.splice(fromIndex, 1);
	result.splice(toIndex, 0, element);
	return result;
}

/**
 * Check if user has premium subscription
 * Works with Clerk user object
 */
export function isUserPremium(user: { publicMetadata?: { isPremium?: boolean } } | null): boolean {
	return user?.publicMetadata?.isPremium === true;
}

/**
 * Generate a unique ID
 */
export function generateId(): number {
	return Date.now() + Math.floor(Math.random() * 1000);
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
	fn: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout>;

	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
}

/**
 * Throttle a function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
	fn: T,
	limit: number
): (...args: Parameters<T>) => void {
	let inThrottle = false;

	return (...args: Parameters<T>) => {
		if (!inThrottle) {
			fn(...args);
			inThrottle = true;
			setTimeout(() => (inThrottle = false), limit);
		}
	};
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate a string to a max length with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
	if (!str || str.length <= maxLength) return str;
	return str.slice(0, maxLength - 3) + '...';
}

/**
 * Sleep for a given number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}
