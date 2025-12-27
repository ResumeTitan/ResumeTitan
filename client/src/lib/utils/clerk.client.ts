import Clerk from '@clerk/clerk-js';
import { browser } from '$app/environment';

let clerk: Clerk | null = null;
let clerkLoadPromise: Promise<Clerk | null> | null = null;
let lastError: string | null = null;

export function getLastClerkError(): string | null {
    return lastError;
}

export async function getClerk(): Promise<Clerk | null> {
    if (!browser) {
        lastError = 'Not in browser environment';
        return null;
    }

    // If already loaded, return it
    if (clerk) return clerk;

    // If currently loading, wait for that promise
    if (clerkLoadPromise) return clerkLoadPromise;

    // Start loading
    clerkLoadPromise = (async () => {
        try {
            const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

            if (!publishableKey) {
                lastError = 'Clerk publishable key is not configured';
                console.error(lastError);
                return null;
            }

            console.log('Clerk init: Creating Clerk instance...');
            const clerkInstance = new Clerk(publishableKey);

            // Add timeout for mobile connections
            console.log('Clerk init: Loading Clerk...');
            const loadPromise = clerkInstance.load();
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error('Clerk load timeout (15s)')), 15000);
            });

            await Promise.race([loadPromise, timeoutPromise]);

            console.log('Clerk init: Clerk loaded successfully');
            clerk = clerkInstance;
            lastError = null;
            return clerk;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            lastError = `Failed to load Clerk: ${errorMessage}`;
            console.error('Clerk init error:', lastError, error);
            clerkLoadPromise = null; // Allow retry on next call
            return null;
        }
    })();

    return clerkLoadPromise;
}
