<script lang="ts">
    /**
     * CommentsSidebar
     *
     * Slide-in panel showing all comments with filtering (All/Open/Resolved).
     * On mobile, displays as fullscreen overlay with slide-in animation.
     */
    import { createEventDispatcher, onMount, onDestroy } from 'svelte';
    import type { WorkshopComment, WorkshopUser, CommentFilter } from '$types';
    import CommentThread from './CommentThread.svelte';
    import CommentInput from './CommentInput.svelte';

    export let comments: WorkshopComment[] = [];
    export let currentUser: WorkshopUser;
    export let isOpen = false;
    export let variant: 'overlay' | 'anchored' = 'overlay';

    let filter: CommentFilter = 'all';
    let isMobile = false;

    function checkMobile() {
        isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    }

    onMount(() => {
        checkMobile();
        window.addEventListener('resize', checkMobile);
    });

    onDestroy(() => {
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', checkMobile);
        }
    });

    const dispatch = createEventDispatcher<{
        close: void;
        addComment: { text: string };
        reply: { commentId: string; text: string };
        resolve: { commentId: string };
        unresolve: { commentId: string };
    }>();

    $: filteredComments = comments.filter(comment => {
        if (filter === 'all') return true;
        if (filter === 'open') return !comment.resolved;
        if (filter === 'resolved') return comment.resolved;
        return true;
    });

    $: openCount = comments.filter(c => !c.resolved).length;
    $: resolvedCount = comments.filter(c => c.resolved).length;

    function handleAddComment(event: CustomEvent<{ text: string }>) {
        dispatch('addComment', event.detail);
    }

    function handleReply(event: CustomEvent<{ commentId: string; text: string }>) {
        dispatch('reply', event.detail);
    }

    function handleResolve(event: CustomEvent<{ commentId: string }>) {
        dispatch('resolve', event.detail);
    }

    function handleUnresolve(event: CustomEvent<{ commentId: string }>) {
        dispatch('unresolve', event.detail);
    }
</script>

{#if isOpen}
    <div
        class="comments-sidebar bg-white shadow-2xl"
        class:comments-sidebar-mobile={isMobile}
        class:is-open={isOpen}
        class:is-closing={!isOpen}
    >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <div class="flex items-center gap-2">
                <h2 class="font-semibold text-lg">Comments</h2>
                <span class="bg-main-green text-white text-xs px-2 py-0.5 rounded-full">
                    {comments.length}
                </span>
            </div>
            <button class="p-1 hover:bg-gray-100 rounded transition-colors" on:click={() => dispatch('close')} aria-label="Close comments">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <!-- Filter Tabs -->
        <div class="flex border-b border-gray-200">
            <button
                class="flex-1 px-4 py-2 text-sm font-medium transition-colors"
                class:text-main-green={filter === 'all'}
                class:border-b-2={filter === 'all'}
                class:border-main-green={filter === 'all'}
                class:text-gray-500={filter !== 'all'}
                on:click={() => (filter = 'all')}
            >
                All
            </button>
            <button
                class="flex-1 px-4 py-2 text-sm font-medium transition-colors"
                class:text-main-green={filter === 'open'}
                class:border-b-2={filter === 'open'}
                class:border-main-green={filter === 'open'}
                class:text-gray-500={filter !== 'open'}
                on:click={() => (filter = 'open')}
            >
                Open ({openCount})
            </button>
            <button
                class="flex-1 px-4 py-2 text-sm font-medium transition-colors"
                class:text-main-green={filter === 'resolved'}
                class:border-b-2={filter === 'resolved'}
                class:border-main-green={filter === 'resolved'}
                class:text-gray-500={filter !== 'resolved'}
                on:click={() => (filter = 'resolved')}
            >
                Resolved ({resolvedCount})
            </button>
        </div>

        <!-- Add Comment -->
        <div class="p-4 border-b border-gray-200">
            <CommentInput {currentUser} on:submit={handleAddComment} />
        </div>

        <!-- Comments List -->
        <div class="flex-1 overflow-y-auto">
            {#if filteredComments.length === 0}
                <div class="flex flex-col items-center justify-center py-12 text-gray-400">
                    <svg class="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                    </svg>
                    <p class="text-sm">
                        {#if filter === 'all'}
                            No comments yet
                        {:else if filter === 'open'}
                            No open comments
                        {:else}
                            No resolved comments
                        {/if}
                    </p>
                </div>
            {:else}
                {#each filteredComments as comment (comment.id)}
                    <CommentThread
                        {comment}
                        {currentUser}
                        on:reply={handleReply}
                        on:resolve={handleResolve}
                        on:unresolve={handleUnresolve}
                    />
                {/each}
            {/if}
        </div>
    </div>
{/if}

<!-- Backdrop - show on overlay variant OR on mobile -->
{#if isOpen && (variant === 'overlay' || isMobile)}
    <div
        class="comments-backdrop fixed inset-0 bg-black bg-opacity-20 z-40"
        on:click={() => dispatch('close')}
        on:keydown={e => e.key === 'Escape' && dispatch('close')}
        role="button"
        tabindex="0"
    ></div>
{/if}

<style>
    .comments-backdrop {
        z-index: 45;
    }

    /* Ensure mobile sidebar is above backdrop */
    @media (max-width: 768px) {
        :global(.comments-sidebar) {
            z-index: 50 !important;
        }
    }
</style>
