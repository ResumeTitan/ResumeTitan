<script lang="ts">
    /**
     * Workshop Page
     *
     * Collaborative resume editing with comments, user presence, and real-time features.
     * This is a wrapper around ResumeEditorCore that adds collaborative functionality.
     */
    import { onMount, onDestroy } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { workshopApi, resumeApi } from '$api';
    import { resumeStore, isAuthenticated, authStore } from '$stores';
    import { presenceStore } from '$lib/stores/presence';
    import { workshopSocket } from '$lib/services/websocket';
    import type { WorkshopType, WorkshopRole, ResumeType, WorkshopUser, WorkshopComment } from '$types';

    import Spinner from '$components/ui/Spinner.svelte';
    import Alert from '$components/ui/Alert.svelte';
    import ResumeEditorCore from '$components/editors/ResumeEditorCore.svelte';
    import { WorkshopHeader, CommentsSidebar, ShareModal } from '$components/workshop';

    // Page state
    let workshop: WorkshopType | null = null;
    let resume: ResumeType | null = null;
    let loading = true;
    let saving = false;
    let error = '';
    let lastSaved: Date | null = null;
    let mode: 'editing' | 'preview' = 'editing';
    let showComments = false;
    let showShareModal = false;
    let role: WorkshopRole = 'owner';
    let canEdit = true;

    $: workshopId = $page.params.id || '';

    // ============================================
    // DERIVED DATA
    // ============================================

    // Get current user from workshop participants
    $: currentUser = workshop?.participants.find(p => p.clerkId === $authStore.userId) || {
        clerkId: $authStore.userId || '',
        name: $authStore.userName || 'You',
        email: $authStore.userEmail || '',
        initials: ($authStore.userName || 'Y')
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2),
        color: '#115E59',
        isOnline: true,
        isActive: true,
    };

    // Get comments from workshop
    $: comments = workshop?.comments || [];

    // Get participants for user presence
    $: participants = workshop?.participants || [];

    // Track if we've already initiated loading to prevent duplicate calls
    let loadingInitiated = false;

    // ============================================
    // LIFECYCLE
    // ============================================

    onMount(async () => {
        // Wait for Clerk to be ready before checking auth or loading data
        const { getClerk } = await import('$lib/utils/clerk.client');
        let clerk = await getClerk();

        // Wait for Clerk session to be available (handles page reload/navigation case)
        // Poll for up to 3 seconds to allow session restoration
        let attempts = 0;
        const maxAttempts = 30;
        while (attempts < maxAttempts) {
            clerk = await getClerk();
            if (clerk?.session) break;
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        // Check if we have a valid Clerk session (this is the source of truth)
        const hasValidSession = !!clerk?.session;

        if (!hasValidSession) {
            authStore.openAuthModal();
            return;
        }

        if (workshopId) {
            loadingInitiated = true;
            await loadWorkshop();
            await setupWebSocket();
        }
    });

    onDestroy(() => {
        // Clean up WebSocket connection when leaving the page
        workshopSocket.leaveWorkshop();
        presenceStore.reset();
    });

    // Watch for authentication changes - only trigger if we haven't loaded yet
    $: if ($isAuthenticated && workshopId && loading && !resume && !error && !loadingInitiated) {
        loadingInitiated = true;
        loadWorkshop();
    }

    // ============================================
    // WEBSOCKET SETUP
    // ============================================

    async function setupWebSocket() {
        if (!workshopId) {
            return;
        }

        // Get Clerk user info
        const { getClerk } = await import('$lib/utils/clerk.client');
        const clerk = await getClerk();

        if (!clerk?.user) {
            console.error('No Clerk user found for WebSocket setup');
            return;
        }

        const userId = clerk.user.id;
        const userName = clerk.user.fullName || clerk.user.primaryEmailAddress?.emailAddress || 'Anonymous';
        const userEmail = clerk.user.primaryEmailAddress?.emailAddress || '';
        const userAvatar = clerk.user.imageUrl || '';

        // Connect to WebSocket server
        workshopSocket.connect();

        // Join the workshop room
        workshopSocket.joinWorkshop({
            workshopId,
            userId,
            userName,
            userEmail,
            userAvatar,
        });

        // Listen for participants list
        workshopSocket.on('participants-list', (data: { participants: any[] }) => {
            console.log('📋 Received participants list:', data.participants);
            presenceStore.setParticipants(data.participants);
            presenceStore.setConnected(true);
        });

        // Listen for user joined events
        workshopSocket.on('user-joined', (data: any) => {
            console.log('👋 User joined:', data.userName);
            presenceStore.userJoined({
                userId: data.userId,
                userName: data.userName,
                userEmail: data.userEmail,
                userAvatar: data.userAvatar,
                initials: data.initials,
                color: data.color,
                isOnline: data.isOnline,
                isActive: data.isActive,
            });
        });

        // Listen for user left events
        workshopSocket.on('user-left', (data: { userId: string }) => {
            console.log('👋 User left:', data.userId);
            presenceStore.userLeft(data.userId);
        });

        // Listen for user active events
        workshopSocket.on('user-active', (data: { userId: string }) => {
            console.log('✅ User active:', data.userId);
            presenceStore.userActive(data.userId);
        });

        // Listen for user idle events
        workshopSocket.on('user-idle', (data: { userId: string }) => {
            console.log('💤 User idle:', data.userId);
            presenceStore.userIdle(data.userId);
        });

        // Listen for errors
        workshopSocket.on('error', (data: { message: string }) => {
            console.error('❌ WebSocket error:', data.message);
            error = data.message;
        });

        console.log('🔌 WebSocket setup complete for workshop:', workshopId);
    }

    // ============================================
    // DATA LOADING
    // ============================================

    async function loadWorkshop() {
        if (!workshopId) return;
        loading = true;
        error = '';

        try {
            const workshopResp = await workshopApi.getById(workshopId);
            workshop = workshopResp.workshop;
            role = workshopResp.role || 'owner';
            canEdit = workshopResp.canEdit ?? true;
            const resumeResp = await resumeApi.getById(workshop.resumeId);
            resume = resumeResp.resume;
            resumeStore.set(resume);
            lastSaved = new Date();
        } catch (e) {
            error = 'Failed to load workshop. Please try again.';
            console.error(e);
        } finally {
            loading = false;
        }
    }

    // ============================================
    // ACTIONS
    // ============================================

    async function saveWorkshop() {
        if (!workshop) return;

        saving = true;
        try {
            await resumeApi.update(resume!);
            resumeStore.markSaved();
            lastSaved = new Date();
        } catch (e) {
            error = 'Failed to save resume. Please try again.';
        } finally {
            saving = false;
        }
    }

    function handleBack() {
        goto('/dashboard');
    }

    let nameUpdateTimeout: ReturnType<typeof setTimeout>;

    function handleNameChange(event: CustomEvent<{ name: string }>) {
        if (workshop) {
            workshop.name = event.detail.name;

            // Debounce the save - wait 500ms after user stops typing
            clearTimeout(nameUpdateTimeout);
            nameUpdateTimeout = setTimeout(() => {
                saveWorkshopName(event.detail.name);
            }, 500);
        }
    }

    async function saveWorkshopName(name: string) {
        if (!workshop) return;

        try {
            await workshopApi.update(workshopId, { name });
        } catch (e) {
            console.error('Failed to save workshop name:', e);
            error = 'Failed to save workshop name. Please try again.';
        }
    }

    function handleThemeChange(event: CustomEvent<{ theme: string }>) {
        if (resume) {
            resume = { ...resume, theme: event.detail.theme as ResumeType['theme'] };
        }
    }

    function togglePreview() {
        mode = mode === 'editing' ? 'preview' : 'editing';
    }

    function toggleComments() {
        showComments = !showComments;
    }

    function handleShare() {
        showShareModal = true;
    }

    async function handleShareToggle(event: CustomEvent<{ enabled: boolean }>) {
        if (!workshop) return;

        try {
            const result = await workshopApi.toggleSharing(workshopId, event.detail.enabled);
            workshop = result.workshop;
        } catch (e) {
            console.error('Failed to toggle sharing:', e);
            error = 'Failed to update sharing settings. Please try again.';
        }
    }

    function handleHistory() {
        // TODO: Implement version history
        alert('Version history coming soon!');
    }

    function handleExport() {
        if (!resume) return;
        // Open print page in new tab for PDF export
        window.open(`/print-resume/${resume._id}`, '_blank');
    }

    // ============================================
    // COMMENT HANDLERS
    // ============================================

    async function handleAddComment(event: CustomEvent<{ text: string }>) {
        if (!workshop) return;

        try {
            const result = await workshopApi.addComment(workshopId, {
                text: event.detail.text,
                authorName: currentUser.name,
                authorEmail: currentUser.email,
            });
            // Add new comment to the front of the list
            workshop = {
                ...workshop,
                comments: [result.comment, ...workshop.comments],
            };
        } catch (e) {
            console.error('Failed to add comment:', e);
            error = 'Failed to add comment. Please try again.';
        }
    }

    async function handleReply(event: CustomEvent<{ commentId: string; text: string }>) {
        if (!workshop) return;
        const { commentId, text } = event.detail;

        try {
            const result = await workshopApi.replyToComment(workshopId, commentId, {
                text,
                authorName: currentUser.name,
                authorEmail: currentUser.email,
            });
            // Update the comment with the new reply
            workshop = {
                ...workshop,
                comments: workshop.comments.map(comment => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            replies: [...comment.replies, result.reply],
                        };
                    }
                    return comment;
                }),
            };
        } catch (e) {
            console.error('Failed to reply:', e);
            error = 'Failed to add reply. Please try again.';
        }
    }

    async function handleResolve(event: CustomEvent<{ commentId: string }>) {
        if (!workshop) return;

        try {
            await workshopApi.resolveComment(workshopId, event.detail.commentId, true);
            workshop = {
                ...workshop,
                comments: workshop.comments.map(comment =>
                    comment.id === event.detail.commentId ? { ...comment, resolved: true } : comment
                ),
            };
        } catch (e) {
            console.error('Failed to resolve comment:', e);
            error = 'Failed to resolve comment. Please try again.';
        }
    }

    async function handleUnresolve(event: CustomEvent<{ commentId: string }>) {
        if (!workshop) return;

        try {
            await workshopApi.resolveComment(workshopId, event.detail.commentId, false);
            workshop = {
                ...workshop,
                comments: workshop.comments.map(comment =>
                    comment.id === event.detail.commentId ? { ...comment, resolved: false } : comment
                ),
            };
        } catch (e) {
            console.error('Failed to unresolve comment:', e);
            error = 'Failed to unresolve comment. Please try again.';
        }
    }

    function handleResumeChange() {
        // Track changes for auto-save
        resumeStore.set(resume!);
    }

    $: commentCount = comments.filter(c => !c.resolved).length;
</script>

<svelte:head>
    <title>{workshop?.name || resume?.name || 'Workshop'} - ResumeTitan</title>
</svelte:head>

<div class="workshop-page">
    {#if loading}
        <div class="flex items-center justify-center py-20">
            <Spinner size="lg" />
        </div>
    {:else if error}
        <div class="max-w-4xl mx-auto p-4">
            <Alert variant="error">{error}</Alert>
        </div>
    {:else if resume}
        <!-- Workshop Header - Sticky -->
        <div class="workshop-header-sticky">
            <WorkshopHeader
                {resume}
                workshopName={workshop?.name || ''}
                users={participants}
                {lastSaved}
                {saving}
                {mode}
                {commentCount}
                {role}
                on:save={saveWorkshop}
                on:togglePreview={togglePreview}
                on:toggleComments={toggleComments}
                on:share={handleShare}
                on:export={handleExport}
                on:history={handleHistory}
                on:back={handleBack}
                on:nameChange={handleNameChange}
                on:themeChange={handleThemeChange}
            />
        </div>

        <!-- Mobile Quick Toggle - Floating Action Button -->
        <button
            class="mobile-preview-toggle"
            on:click={togglePreview}
            title={mode === 'editing' ? 'Show Preview' : 'Back to Editing'}
        >
            {#if mode === 'editing'}
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            {:else}
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            {/if}
        </button>

        <!-- Share Modal -->
        {#if workshop}
            <ShareModal
                isOpen={showShareModal}
                {workshopId}
                workshopName={workshop.name}
                shareEnabled={workshop.shareEnabled}
                shareToken={workshop.shareToken}
                on:close={() => (showShareModal = false)}
                on:toggle={handleShareToggle}
            />
        {/if}

        <!-- Main Content Area -->
        <div class="workshop-content">
            <div class="workshop-flex">
                <!-- Editor Panel -->
                <div class="workshop-editor">
                    <ResumeEditorCore
                        bind:resume
                        readonly={mode === 'preview'}
                        showEditor={mode === 'editing'}
                        showPreview={mode === 'preview'}
                        on:change={handleResumeChange}
                    />
                </div>

                <!-- Comments Panel - Snapped to right edge (desktop only) -->
                {#if showComments}
                    <aside class="comments-section">
                        <CommentsSidebar
                            {comments}
                            {currentUser}
                            isOpen={showComments}
                            variant="anchored"
                            on:close={() => (showComments = false)}
                            on:addComment={handleAddComment}
                            on:reply={handleReply}
                            on:resolve={handleResolve}
                            on:unresolve={handleUnresolve}
                        />
                    </aside>
                {/if}
            </div>
        </div>

        <!-- Mobile Comments Overlay - rendered outside flex container for proper positioning -->
        <div class="mobile-comments-container">
            <CommentsSidebar
                {comments}
                {currentUser}
                isOpen={showComments}
                variant="overlay"
                on:close={() => (showComments = false)}
                on:addComment={handleAddComment}
                on:reply={handleReply}
                on:resolve={handleResolve}
                on:unresolve={handleUnresolve}
            />
        </div>
    {/if}
</div>

<style>
    .workshop-page {
        min-height: 100vh;
        height: 100vh;
        display: flex;
        flex-direction: column;
        background-color: #f9fafb;
        overflow-y: auto;
    }

    /* Workshop Header Container */
    .workshop-header-sticky {
        flex-shrink: 0;
        /* Sticky is now on .header-row-2-sticky inside WorkshopHeader */
    }

    /* Mobile Preview Toggle - Floating Action Button */
    .mobile-preview-toggle {
        display: none;
        position: fixed;
        bottom: 1.5rem;
        right: 1.5rem;
        z-index: 50;
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 50%;
        background: linear-gradient(135deg, #115E59 0%, #0D9488 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(17, 94, 89, 0.4);
        border: none;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }

    .mobile-preview-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(17, 94, 89, 0.5);
    }

    .mobile-preview-toggle:active {
        transform: scale(0.95);
    }

    .workshop-content {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
    }

    .workshop-flex {
        display: flex;
        gap: 1.5rem;
        overflow-x: hidden; /* Prevent horizontal overflow in flex container */
        min-height: 100%;
    }

    .workshop-editor {
        flex: 1;
        min-width: 0;
        padding-right: 0;
        overflow-x: hidden; /* Prevent horizontal overflow in editor */
    }

    /* Desktop: show aside comments, hide mobile container */
    .comments-section {
        display: block;
    }

    .mobile-comments-container {
        display: none;
    }

    /* Mobile: hide aside comments, show mobile container */
    @media (max-width: 768px) {
        .workshop-flex {
            flex-direction: column;
            gap: 0.5rem;
        }

        .comments-section {
            display: none;
        }

        .mobile-comments-container {
            display: block;
        }

        /* Show mobile preview toggle button */
        .mobile-preview-toggle {
            display: flex;
        }
    }
</style>
