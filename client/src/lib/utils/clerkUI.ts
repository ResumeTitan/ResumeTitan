import type { Action } from 'svelte/action';
import { getClerk } from './clerk.client';
import { authStore } from '$lib/stores/auth';
import { goto } from '$app/navigation';

type ClerkUIOptions = {
  componentType: 'SignIn' | 'SignUp';
  props?: Record<string, any>;
};

const clerkUI: Action<HTMLElement, ClerkUIOptions> = (node, options) => {
  let mounted = false;
  let clerkInstance: any = null;

  (async () => {
    const clerk = await getClerk();
    if (!clerk) return;

    clerkInstance = clerk;

    // Listen for session changes to handle successful sign-in
    clerk.addListener((resources) => {
      if (resources.session) {
        // User signed in successfully - close modal and update auth store
        authStore.closeAuthModal();

        // Update auth store with Clerk session data
        const user = resources.user;
        if (user) {
          authStore.setUser({
            id: user.id,
            fullName: user.fullName || undefined,
            email: user.primaryEmailAddress?.emailAddress || undefined
          });
        }

        // Get the token and set it
        resources.session.getToken().then((token) => {
          if (token) {
            authStore.setToken(token);
          }
        });

        // Navigate to dashboard without full page reload
        goto('/dashboard');
      }
    });

    // Mount the component
    const targetNode = node as unknown as HTMLDivElement;
    if (options.componentType === 'SignIn') {
      clerk.mountSignIn(targetNode, {
        ...options.props,
        // Prevent Clerk's default redirect behavior
        afterSignInUrl: undefined,
        redirectUrl: undefined
      });
    } else {
      clerk.mountSignUp(targetNode, {
        ...options.props,
        afterSignUpUrl: undefined,
        redirectUrl: undefined
      });
    }
    mounted = true;
  })();

  return {
    destroy() {
      if (mounted && clerkInstance) {
        if (options.componentType === 'SignIn') {
          clerkInstance.unmountSignIn?.(node);
        } else {
          clerkInstance.unmountSignUp?.(node);
        }
      }
    }
  };
};

export default clerkUI;
