<script lang="ts">
	/**
	 * Shared Workshop Page
	 *
	 * Accessed via share token link. Allows authenticated users to view and comment on a workshop.
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
		CommentsSidebar
	} from '$components/workshop';

	// Page state
	let workshop: WorkshopType | null = null;
	let resume: ResumeType | null = null;
	let loading = true;
	let error = '';
	let lastSaved: Date | null = null;
	let mode: 'editing' | 'preview' = 'preview'; // Default to preview for shared workshops
	let showComments = true;
	let role: WorkshopRole = 'commenter';
	let canEdit = false;

	$: shareToken = $page.params.token || '';

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

	// ============================================
	// LIFECYCLE
	// ============================================

	onMount(async () => {
		// Wait for Clerk to be ready before checking auth or loading data
		const { getClerk } = await import('$lib/utils/clerk.client');
		const clerk = await getClerk();

		// Wait for Clerk session to be available (handles page reload case)
		if (!clerk?.session) {
			await new Promise(resolve => setTimeout(resolve, 100));
		}

		if (!$isAuthenticated) {
			authStore.openAuthModal();
			return;
		}

		if (shareToken) {
			await loadSharedWorkshop();
		}
	});

	// Watch for authentication changes
	$: if ($isAuthenticated && shareToken && loading && !resume && !error) {
		loadSharedWorkshop();
	}

	// ============================================
	// DATA LOADING
	// ============================================

	async function loadSharedWorkshop() {
		if (!shareToken) return;
		loading = true;
		error = '';

		try {
			const result = await workshopApi.getByShareToken(
				shareToken,
				$authStore.userName || 'Anonymous',
				$authStore.userEmail
			);

			// If owner accesses via share link, redirect to main workshop page
			if (result.redirectToWorkshop && result.workshopId) {
				goto(`/workshop/${result.workshopId}`);
				return;
			}

			workshop = result.workshop;
			resume = result.resume;
			role = result.role || 'commenter';
			canEdit = result.canEdit ?? false;
			resumeStore.set(resume);
			lastSaved = new Date();
		} catch (e: any) {
			if (e?.response?.status === 404) {
				error = 'This workshop is not available. The share link may be invalid or sharing has been disabled.';
			} else {
				error = 'Failed to load workshop. Please try again.';
			}
			console.error(e);
		} finally {
			loading = false;
		}
	}

	// ============================================
	// ACTIONS
	// ============================================

	function handleBack() {
		goto('/dashboard');
	}

	function handleThemeChange(event: CustomEvent<{ theme: string }>) {
		if (resume && canEdit) {
			resume = { ...resume, theme: event.detail.theme as ResumeType['theme'] };
		}
	}

	function togglePreview() {
		mode = mode === 'editing' ? 'preview' : 'editing';
	}

	function toggleComments() {
		showComments = !showComments;
	}

	// ============================================
	// COMMENT HANDLERS
	// ============================================

	async function handleAddComment(event: CustomEvent<{ text: string }>) {
		if (!workshop) return;

		try {
			const result = await workshopApi.addComment(workshop._id, {
				text: event.detail.text,
				authorName: currentUser.name,
				authorEmail: currentUser.email
			});
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
			const result = await workshopApi.replyToComment(workshop._id, commentId, {
				text,
				authorName: currentUser.name,
				authorEmail: currentUser.email
			});
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
			await workshopApi.resolveComment(workshop._id, event.detail.commentId, true);
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
			await workshopApi.resolveComment(workshop._id, event.detail.commentId, false);
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

	$: commentCount = comments.filter((c) => !c.resolved).length;
</script>

<svelte:head>
	<title>{workshop?.name || 'Shared Workshop'} - ResumeTitan</title>
</svelte:head>

<div class="workshop-page">
	{#if loading}
		<div class="flex items-center justify-center py-20">
			<Spinner size="lg" />
		</div>
	{:else if error}
		<div class="max-w-4xl mx-auto p-4">
			<Alert variant="error">{error}</Alert>
			<div class="text-center mt-4">
				<a href="/dashboard" class="text-main-green hover:underline">
					Return to Dashboard
				</a>
			</div>
		</div>
	{:else if resume && workshop}
		<!-- Shared Workshop Notice -->
		<div class="bg-blue-50 border-b border-blue-200 px-4 py-2">
			<div class="max-w-7xl mx-auto flex items-center justify-between">
				<div class="flex items-center gap-2 text-blue-700">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
					</svg>
					<span class="text-sm">
						You're viewing a shared workshop by <strong>{workshop.ownerName || 'Unknown'}</strong>
					</span>
				</div>
				<span class="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
					View & Comment Only
				</span>
			</div>
		</div>

		<!-- Workshop Header -->
		<WorkshopHeader
			{resume}
			workshopName={workshop.name}
			users={participants}
			{lastSaved}
			saving={false}
			{mode}
			{commentCount}
			{role}
			on:togglePreview={togglePreview}
			on:toggleComments={toggleComments}
			on:back={handleBack}
			on:themeChange={handleThemeChange}
		/>

		<!-- Main Content Area -->
		<div class="workshop-content">
			<div class="workshop-flex">
				<!-- Editor Panel (Read-only) -->
				<div class="workshop-editor">
					<ResumeEditorCore
						bind:resume
						readonly={true}
						showEditor={mode === 'editing'}
						showPreview={mode === 'preview'}
					/>
				</div>

				<!-- Comments Panel -->
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
	{/if}
</div>

<style>
	.workshop-page {
		min-height: 100vh;
		background-color: #f9fafb;
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
</style>