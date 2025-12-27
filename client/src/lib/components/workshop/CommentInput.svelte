<script lang="ts">
    /**
     * CommentInput
     *
     * Input component for adding new comments or replies.
     */
    import { createEventDispatcher } from 'svelte';
    import type { WorkshopUser } from '$types';
    import Button from '$components/ui/Button.svelte';

    export let currentUser: WorkshopUser;
    export let placeholder = 'Add a comment...';
    export let buttonText = 'Comment';
    export let autofocus = false;

    let text = '';
    let inputElement: HTMLTextAreaElement;

    const dispatch = createEventDispatcher<{
        submit: { text: string };
    }>();

    function handleSubmit() {
        if (!text.trim()) return;
        dispatch('submit', { text: text.trim() });
        text = '';
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            handleSubmit();
        }
    }

    export function focus() {
        inputElement?.focus();
    }
</script>

<div class="comment-input flex gap-3">
    <!-- User Avatar -->
    <div
        class="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-medium text-white"
        style="background-color: {currentUser.color}"
    >
        {#if currentUser.avatar}
            <img src={currentUser.avatar} alt={currentUser.name} class="w-full h-full rounded-full object-cover" />
        {:else}
            {currentUser.initials}
        {/if}
    </div>

    <!-- Input Area -->
    <div class="flex-1">
        <textarea
            bind:this={inputElement}
            bind:value={text}
            {placeholder}
            rows="2"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-main-green focus:border-transparent text-sm"
            on:keydown={handleKeydown}
        ></textarea>

        <div class="flex justify-between items-center mt-2">
            <span class="text-xs text-gray-400"> Ctrl+Enter to submit </span>
            <Button size="sm" on:click={handleSubmit} disabled={!text.trim()}>
                {buttonText}
            </Button>
        </div>
    </div>
</div>
