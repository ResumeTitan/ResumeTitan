<script lang="ts">
    import clerkUI from '$lib/utils/clerkUI';
    import { showAuthModal, authStore } from '$lib/stores/auth';

    let isClerkLoading = true;
    let clerkLoadError = false;
    let errorMessage = '';
    let retryCount = 0;
    let retryKey = 0; // Used to force re-render of clerk container

    function closeModal() {
        authStore.closeAuthModal();
    }

    // Retry loading Clerk
    function retryClerk() {
        retryCount++;
        retryKey++; // Force re-render
        isClerkLoading = true;
        clerkLoadError = false;
        errorMessage = '';
    }

    // Handle clerk error event
    function handleClerkError(event: CustomEvent<{ error: string }>) {
        console.error('Clerk error:', event.detail.error);
        isClerkLoading = false;
        clerkLoadError = true;
        errorMessage = event.detail.error;
    }

    // Handle clerk mounted event
    function handleClerkMounted() {
        isClerkLoading = false;
        clerkLoadError = false;
    }

    // Track when Clerk container mounts to show loading state
    function handleClerkMount(node: HTMLElement) {
        isClerkLoading = true;
        clerkLoadError = false;
        errorMessage = '';

        // Listen for custom events from clerkUI
        node.addEventListener('clerk-error', handleClerkError as EventListener);
        node.addEventListener('clerk-mounted', handleClerkMounted);

        // Set a longer timeout for mobile connections (15 seconds)
        const timeout = setTimeout(() => {
            // Check if the container has any content
            if (node && node.children.length === 0 && isClerkLoading) {
                clerkLoadError = true;
                errorMessage = 'Connection timeout. Please check your internet connection.';
            }
            isClerkLoading = false;
        }, 15000);

        // Use MutationObserver to detect when Clerk renders content
        const observer = new MutationObserver(() => {
            if (node.children.length > 0) {
                isClerkLoading = false;
                clearTimeout(timeout);
                observer.disconnect();
            }
        });

        observer.observe(node, { childList: true, subtree: true });

        return {
            destroy() {
                clearTimeout(timeout);
                observer.disconnect();
                node.removeEventListener('clerk-error', handleClerkError as EventListener);
                node.removeEventListener('clerk-mounted', handleClerkMounted);
            },
        };
    }
</script>

{#if $showAuthModal}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
        class="backdrop"
        on:click={closeModal}
        on:keydown={e => e.key === 'Escape' && closeModal()}
        role="dialog"
        aria-modal="true"
        aria-label="Sign in"
        tabindex="-1"
    >
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="modal" on:click|stopPropagation on:keydown|stopPropagation>
            <button class="close-btn" on:click={closeModal} aria-label="Close modal"> &times; </button>

            {#if isClerkLoading}
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <p>Loading sign in...</p>
                </div>
            {/if}

            {#if clerkLoadError}
                <div class="error-container">
                    <p>Unable to load sign in form.</p>
                    {#if errorMessage}
                        <p class="error-detail">{errorMessage}</p>
                    {/if}
                    <div class="error-buttons">
                        {#if retryCount < 3}
                            <button class="retry-btn" on:click={retryClerk}> Try Again </button>
                        {/if}
                        <button class="retry-btn secondary" on:click={() => window.location.reload()}> Refresh Page </button>
                    </div>
                </div>
            {/if}

            {#key retryKey}
                <div
                    class="clerk-container"
                    class:clerk-hidden={clerkLoadError}
                    use:handleClerkMount
                    use:clerkUI={{
                        componentType: 'SignIn',
                        props: {
                            appearance: {
                                variables: {
                                    colorPrimary: '#115E59',
                                    colorTextOnPrimaryBackground: '#ffffff',
                                    borderRadius: '8px',
                                },
                                elements: {
                                    formButtonPrimary: {
                                        backgroundColor: '#115E59',
                                        '&:hover': {
                                            backgroundColor: '#0b3733',
                                        },
                                    },
                                    rootBox: {
                                        width: '100%',
                                    },
                                    card: {
                                        margin: '0',
                                        boxShadow: 'none',
                                    },
                                },
                            },
                        },
                    }}
                ></div>
            {/key}
        </div>
    </div>
{/if}

<style>
    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        /* Use solid color fallback for Safari */
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        /* backdrop-filter can cause issues on iOS Safari */
        -webkit-backdrop-filter: blur(4px);
        backdrop-filter: blur(4px);
        /* Ensure it's above everything */
        isolation: isolate;
    }

    .modal {
        position: relative;
        background: white;
        border-radius: 12px;
        max-height: 90vh;
        max-height: 90dvh; /* Dynamic viewport height for mobile */
        width: 90%;
        max-width: 400px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        /* Ensure modal is visible */
        min-height: 200px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .close-btn {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: rgba(0, 0, 0, 0.5);
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #fff;
        line-height: 1;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        transition: background 0.2s;
        z-index: 10;
        /* Make touch target larger on mobile */
        min-width: 44px;
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .close-btn:hover,
    .close-btn:active {
        background: rgba(255, 8, 8, 0.7);
    }

    .clerk-container {
        border-radius: 12px;
        overflow: hidden;
        min-height: 150px;
    }

    .clerk-hidden {
        display: none;
    }

    .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem 2rem;
        color: #666;
    }

    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #e5e7eb;
        border-top-color: #115e59;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .error-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        text-align: center;
        color: #666;
    }

    .error-container p {
        margin: 0.5rem 0;
    }

    .error-detail {
        font-size: 0.875rem;
        color: #999;
        font-style: italic;
    }

    .error-buttons {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 1rem;
        width: 100%;
        max-width: 200px;
    }

    .retry-btn {
        padding: 0.75rem 1.5rem;
        background-color: #115e59;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.2s;
        width: 100%;
    }

    .retry-btn:hover,
    .retry-btn:active {
        background-color: #0b3733;
    }

    .retry-btn.secondary {
        background-color: #6b7280;
    }

    .retry-btn.secondary:hover,
    .retry-btn.secondary:active {
        background-color: #4b5563;
    }

    /* Mobile-specific fixes */
    @media (max-width: 768px) {
        .modal {
            width: 95%;
            max-width: none;
            margin: 1rem;
            max-height: 85vh;
            max-height: 85dvh;
        }

        .close-btn {
            top: 0.25rem;
            right: 0.25rem;
        }
    }

    /* Fix for iOS Safari viewport issues */
    @supports (-webkit-touch-callout: none) {
        .backdrop {
            /* Use min-height to handle iOS Safari address bar */
            min-height: -webkit-fill-available;
        }
    }
</style>
