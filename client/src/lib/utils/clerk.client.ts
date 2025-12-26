import Clerk from '@clerk/clerk-js';
import { browser } from '$app/environment';

let clerk: Clerk | null = null;

export async function getClerk() {
  if (!browser) return null;

  if (!clerk) {
    clerk = new Clerk(
      import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
    );
    await clerk.load();
  }

  return clerk;
}
