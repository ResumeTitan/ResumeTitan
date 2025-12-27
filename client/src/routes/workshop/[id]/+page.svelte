<script lang="ts">
	/**
	 * Workshop Page
	 *
	 * Collaborative resume editing with comments, user presence, and real-time features.
	 * This is a wrapper around ResumeEditorCore that adds collaborative functionality.
	 */
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { workshopApi, resumeApi } from '$api';
	import { resumeStore, isAuthenticated, authStore } from '$stores';
	import type { WorkshopType, WorkshopRole, ResumeType, WorkshopUser, WorkshopComment } from '$types';

	import Spinner from '$components/ui/Spinner.svelte';
	import Alert from '$components/ui/Alert.svelte';
	import ResumeEditorCore from '$components/editors/ResumeEditorCore.svelte';
	import {
		WorkshopHeader,
		CommentsSidebar,
		ShareModal
	} from '$components/workshop';

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
		initials: ($authStore.userName || 'Y').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
		color: '#115E59',
		isOnline: true,
		isActive: true
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
		}
	});

	// Watch for authentication changes - only trigger if we haven't loaded yet
	$: if ($isAuthenticated && workshopId && loading && !resume && !error && !loadingInitiated) {
		loadingInitiated = true;
		loadWorkshop();
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

	// ============================================
	// COMMENT HANDLERS
	// ============================================

	async function handleAddComment(event: CustomEvent<{ text: string }>) {
		if (!workshop) return;

		try {
			const result = await workshopApi.addComment(workshopId, {
				text: event.detail.text,
				authorName: currentUser.name,
				authorEmail: currentUser.email
			});
			// Add new comment to the front of the list
			workshop = {
				...workshop,
				comments: [result.comment, ...workshop.comments]
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
				authorEmail: currentUser.email
			});
			// Update the comment with the new reply
			workshop = {
				...workshop,
				comments: workshop.comments.map((comment) => {
					if (comment.id === commentId) {
						return {
							...comment,
							replies: [...comment.replies, result.reply]
						};
					}
					return comment;
				})
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
				comments: workshop.comments.map((comment) =>
					comment.id === event.detail.commentId ? { ...comment, resolved: true } : comment
				)
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
				comments: workshop.comments.map((comment) =>
					comment.id === event.detail.commentId ? { ...comment, resolved: false } : comment
				)
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

	$: commentCount = comments.filter((c) => !c.resolved).length;
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
		<!-- Workshop Header -->
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
			on:history={handleHistory}
			on:back={handleBack}
			on:nameChange={handleNameChange}
			on:themeChange={handleThemeChange}
		/>

		<!-- Share Modal -->
		{#if workshop}
			<ShareModal
				isOpen={showShareModal}
				workshopId={workshopId}
				workshopName={workshop.name}
				shareEnabled={workshop.shareEnabled}
				shareToken={workshop.shareToken}
				on:close={() => showShareModal = false}
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
		background-color: #f9fafb;
		overflow-x: hidden;
	}

	.workshop-flex {
		display: flex;
		gap: 1.5rem;
	}

	.workshop-editor {
		flex: 1;
		min-width: 0;
		padding-right: 0;
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
	}
</style>
