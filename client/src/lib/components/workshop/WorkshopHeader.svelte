<script lang="ts">
    /**
     * WorkshopHeader
     *
     * Top header for the workshop page with:
     * - Back to Dashboard link
     * - Resume name (editable)
     * - Last saved timestamp
     * - User presence avatars
     * - Mode indicator (Editing/Preview)
     * - Template selector
     * - Action buttons (Preview, Save, History, Comments, Share, Export)
     */
    import { createEventDispatcher } from 'svelte';
    import type { WorkshopUser, ResumeType } from '$types';
    import { RESUME_THEMES } from '$config';
    import Button from '$components/ui/Button.svelte';
    import UserPresenceBar from './UserPresenceBar.svelte';

    export let resume: ResumeType;
    export let workshopName = '';
    export let users: WorkshopUser[] = [];
    export let lastSaved: Date | null = null;
    export let saving = false;
    export let mode: 'editing' | 'preview' = 'editing';
    export let commentCount = 0;
    export let role: 'owner' | 'commenter' = 'owner';

    $: isOwner = role === 'owner';
    $: displayName = workshopName || resume.name || 'Untitled Workshop';

    const dispatch = createEventDispatcher<{
        save: void;
        togglePreview: void;
        toggleComments: void;
        share: void;
        export: void;
        history: void;
        back: void;
        nameChange: { name: string };
        themeChange: { theme: string };
    }>();

    function formatLastSaved(date: Date | null): string {
        if (!date) return 'Not saved yet';
        return `Auto-saved ${date.toLocaleTimeString()}`;
    }
</script>

<header class="workshop-header bg-white border-b border-gray-200">
    <!-- Row 1: Navigation & Document Info -->
    <div class="header-row-1 flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <!-- Left: Back & Title -->
        <div class="header-left flex items-center gap-4">
            <button
                class="back-btn flex items-center gap-1 text-gray-600 hover:text-main-green transition-colors text-sm"
                on:click={() => dispatch('back')}
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span class="back-text">Back to Dashboard</span>
            </button>

            <div class="title-section flex items-center gap-2">
                <svg class="doc-icon w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                <input
                    type="text"
                    value={displayName}
                    on:input={e => dispatch('nameChange', { name: e.currentTarget.value })}
                    class="title-input text-lg font-semibold bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-main-green focus:outline-none px-1"
                    placeholder="Workshop Name"
                />
                <button class="edit-btn p-1 text-gray-400 hover:text-gray-600" title="Edit name">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Right: Last Saved & Users -->
        <div class="header-right flex items-center gap-4">
            <span class="save-status text-sm text-gray-400 flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="save-text">{formatLastSaved(lastSaved)}</span>
            </span>

            <UserPresenceBar {users} />
        </div>
    </div>

    <!-- Row 2: Mode & Actions -->
    <div class="header-row-2 flex items-center justify-between px-4 py-2">
        <!-- Left: Mode Badge & Template Selector -->
        <div class="mode-section flex items-center gap-4">
            <span
                class="mode-badge px-3 py-1 text-xs font-medium rounded-full"
                class:bg-main-green={mode === 'editing'}
                class:text-white={mode === 'editing'}
                class:bg-gray-100={mode === 'preview'}
                class:text-gray-600={mode === 'preview'}
            >
                {mode === 'editing' ? 'Editing' : 'Preview'}
            </span>

            <!-- Template Selector -->
            <div class="template-selector flex items-center gap-2">
                <svg class="template-icon w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                    />
                </svg>
                <span class="template-label text-sm text-gray-600">Template:</span>
                <select
                    value={resume.theme}
                    on:change={e => dispatch('themeChange', { theme: e.currentTarget.value })}
                    class="template-select text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-main-green"
                >
                    {#each RESUME_THEMES as theme}
                        <option value={theme.value}>{theme.label}</option>
                    {/each}
                </select>
            </div>
        </div>

        <!-- Right: Action Buttons -->
        <div class="actions-section flex items-center gap-2">
            {#if mode === 'editing'}
            <Button variant="ghost" size="sm" on:click={() => dispatch('togglePreview')}>
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                </svg>
                <span class="btn-text">Preview</span>
            </Button>
            {:else}
            <Button variant="ghost" size="sm" on:click={() => dispatch('togglePreview')}>
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                        d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" 
                        stroke-width="2" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                    />
                    <path 
                        d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" 
                        stroke-width="2" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                    />
                </svg>
                <span class="btn-text">Editing</span>
            </Button>
            {/if}

            <Button variant="primary" size="sm" loading={saving} on:click={() => dispatch('save')}>
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                </svg>
                <span class="btn-text">Save</span>
            </Button>

            <div class="divider h-6 w-px bg-gray-200 mx-1"></div>

            <Button variant="ghost" size="sm" on:click={() => dispatch('history')}>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="btn-text ml-1">History</span>
            </Button>

            <div class="comments-btn-wrapper relative">
                <Button variant="ghost" size="sm" on:click={() => dispatch('toggleComments')}>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                    </svg>
                    <span class="btn-text ml-1">Comments</span>
                    <span
                        class="comment-badge-inline ml-1 bg-main-green text-white text-xs px-1.5 py-0.5 rounded-full"
                        class:hidden={commentCount === 0}
                    >
                        {commentCount}
                    </span>
                </Button>
                {#if commentCount > 0}
                    <span class="comment-badge-mobile bg-main-green text-white text-xs px-1.5 py-0.5 rounded-full">
                        {commentCount}
                    </span>
                {/if}
            </div>

            {#if isOwner}
                <Button variant="ghost" size="sm" on:click={() => dispatch('share')}>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                    </svg>
                    <span class="btn-text ml-1">Share</span>
                </Button>
            {/if}

            <Button variant="ghost" size="sm" on:click={() => dispatch('export')}>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                </svg>
                <span class="btn-text ml-1">Export</span>
            </Button>

            <!-- More Menu -->
            <button class="more-btn p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                </svg>
            </button>
        </div>
    </div>
</header>

<style>
    /* Mobile responsive styles */
    @media (max-width: 768px) {
        .header-row-1 {
            flex-wrap: wrap;
            gap: 0.5rem;
            padding: 0.5rem;
        }

        .header-left {
            flex-wrap: wrap;
            gap: 0.5rem;
            width: 100%;
        }

        .back-text {
            display: none;
        }

        .back-btn {
            padding: 0.25rem;
        }

        .title-section {
            flex: 1;
            min-width: 0;
        }

        .title-input {
            font-size: 0.875rem;
        }

        .doc-icon,
        .edit-btn {
            display: none;
        }

        .header-right {
            width: 100%;
            justify-content: space-between;
        }

        .save-status {
            font-size: 0.75rem;
        }

        .save-text {
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .header-row-2 {
            flex-wrap: wrap;
            gap: 0.5rem;
            padding: 0.5rem;
        }

        .mode-section {
            width: 100%;
            justify-content: space-between;
        }

        .template-label {
            display: none;
        }

        .template-icon {
            display: none;
        }

        .template-select {
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
        }

        .actions-section {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
            gap: 0.25rem;
        }

        .btn-text {
            display: none;
        }

        .divider {
            display: none;
        }

        /* Hide inline badge on mobile, show mobile badge */
        .comment-badge-inline {
            display: none;
        }

        .comment-badge-mobile {
            display: flex;
            position: absolute;
            top: -4px;
            right: -4px;
            font-size: 0.625rem;
            padding: 0.125rem 0.375rem;
            min-width: 1rem;
            justify-content: center;
            align-items: center;
        }

        /* Make buttons icon-only on mobile */
        :global(.actions-section .btn) {
            padding: 0.5rem;
            min-width: auto;
        }
    }

    /* Desktop: hide mobile badge, show inline badge */
    .comment-badge-mobile {
        display: none !important;
    }

    .comment-badge-inline.hidden {
        display: none !important;
    }

    /* Mobile: show mobile badge (overrides desktop rule) */
    @media (max-width: 768px) {
        .comment-badge-mobile {
            display: flex !important;
        }
    }

    @media (max-width: 480px) {
        .title-input {
            max-width: 100px;
        }

        .mode-badge {
            font-size: 0.625rem;
            padding: 0.25rem 0.5rem;
        }
    }
</style>
