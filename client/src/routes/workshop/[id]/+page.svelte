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
	import type { WorkshopType, ResumeType, WorkshopUser, WorkshopComment } from '$types';

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
	let saving = false;
	let error = '';
	let lastSaved: Date | null = null;
	let mode: 'editing' | 'preview' = 'editing';
	let showComments = true;

	$: workshopId = $page.params.id || '';

	// ============================================
	// MOCK DATA - Replace with real data later
	// ============================================

	const mockUsers: WorkshopUser[] = [
		{
			id: 'user-1',
			name: 'You',
			initials: 'Y',
			color: '#115E59',
			isOnline: true,
			isActive: true
		},
		{
			id: 'user-2',
			name: 'Michael Chen',
			initials: 'MC',
			color: '#7C3AED',
			isOnline: true,
			isActive: false
		},
		{
			id: 'user-3',
			name: 'Sarah Johnson',
			initials: 'SJ',
			color: '#DC2626',
			isOnline: true,
			isActive: false
		},
		{
			id: 'user-4',
			name: 'Alex Kim',
			initials: 'AK',
			color: '#2563EB',
			isOnline: false,
			isActive: false
		}
	];

	let comments: WorkshopComment[] = [
		{
			id: 'comment-1',
			author: mockUsers[1],
			text: 'The professional summary could be more impactful. Consider starting with your years of experience and key achievements. Maybe something like "7+ years of full-stack development experience with proven track record of delivering scalable web applications."',
			timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
			section: 'Professional Summary',
			resolved: false,
			replies: []
		},
		{
			id: 'comment-2',
			author: mockUsers[2],
			text: 'Great job on the work experience section! The bullet points are clear and quantified.',
			timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
			section: 'Work Experience',
			resolved: false,
			replies: [
				{
					id: 'reply-1',
					author: mockUsers[0],
					text: 'Thanks! I tried to follow the STAR method.',
					timestamp: new Date(Date.now() - 20 * 60 * 1000),
					resolved: false,
					replies: []
				}
			]
		},
		{
			id: 'comment-3',
			author: mockUsers[1],
			text: 'Consider adding more technical skills - especially cloud platforms like AWS or GCP.',
			timestamp: new Date(Date.now() - 15 * 60 * 1000),
			section: 'Skills',
			resolved: true,
			replies: []
		},
		{
			id: 'comment-4',
			author: mockUsers[2],
			text: 'The education section looks good, but you might want to add relevant coursework or GPA if it was above 3.5.',
			timestamp: new Date(Date.now() - 10 * 60 * 1000),
			section: 'Education',
			resolved: false,
			replies: []
		},
		{
			id: 'comment-5',
			author: mockUsers[3],
			text: 'Should we add a Projects section? It would be great to showcase some personal or open-source work.',
			timestamp: new Date(Date.now() - 5 * 60 * 1000),
			resolved: false,
			replies: []
		},
		{
			id: 'comment-6',
			author: mockUsers[1],
			text: 'Overall, this is looking really solid! Just a few more tweaks and it will be perfect.',
			timestamp: new Date(Date.now() - 2 * 60 * 1000),
			resolved: false,
			replies: []
		}
	];

	const currentUser = mockUsers[0];

	// ============================================
	// LIFECYCLE
	// ============================================

	onMount(async () => {
		// Wait for Clerk to be ready before checking auth or loading data
		const { getClerk } = await import('$lib/utils/clerk.client');
		const clerk = await getClerk();

		// Wait for Clerk session to be available (handles page reload case)
		if (!clerk?.session) {
			// Give Clerk a moment to restore the session on reload
			await new Promise(resolve => setTimeout(resolve, 100));
		}

		if (!$isAuthenticated) {
			authStore.openAuthModal();
			return;
		}

		if (workshopId) {
			await loadWorkshop();
		}
	});

	// Watch for authentication changes - only trigger if we haven't loaded yet
	$: if ($isAuthenticated && workshopId && loading && !resume && !error) {
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

	function handleNameChange(event: CustomEvent<{ name: string }>) {
		if (workshop) {
			workshop.name = event.detail.name;
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
        // TODO: Implement share functionality
        alert('Share functionality coming soon!');
    }

    function handleHistory() {
        // TODO: Implement version history
        alert('Version history coming soon!');
    }

	// ============================================
	// COMMENT HANDLERS
	// ============================================

	function handleAddComment(event: CustomEvent<{ text: string }>) {
		const newComment: WorkshopComment = {
			id: `comment-${Date.now()}`,
			author: currentUser,
			text: event.detail.text,
			timestamp: new Date(),
			resolved: false,
			replies: []
		};
		comments = [newComment, ...comments];
	}

	function handleReply(event: CustomEvent<{ commentId: string; text: string }>) {
		const { commentId, text } = event.detail;
		comments = comments.map((comment) => {
			if (comment.id === commentId) {
				return {
					...comment,
					replies: [
						...comment.replies,
						{
							id: `reply-${Date.now()}`,
							author: currentUser,
							text,
							timestamp: new Date(),
							resolved: false,
							replies: []
						}
					]
				};
			}
			return comment;
		});
	}

	function handleResolve(event: CustomEvent<{ commentId: string }>) {
		comments = comments.map((comment) =>
			comment.id === event.detail.commentId ? { ...comment, resolved: true } : comment
		);
	}

	function handleUnresolve(event: CustomEvent<{ commentId: string }>) {
		comments = comments.map((comment) =>
			comment.id === event.detail.commentId ? { ...comment, resolved: false } : comment
		);
	}

	function handleResumeChange() {
		// Track changes for auto-save
		resumeStore.set(resume!);
	}

	$: commentCount = comments.filter((c) => !c.resolved).length;
</script>

<svelte:head>
	<title>{resume?.name || 'Workshop'} - ResumeTitan</title>
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
			users={mockUsers}
			{lastSaved}
			{saving}
			{mode}
			{commentCount}
			on:save={saveWorkshop}
			on:togglePreview={togglePreview}
			on:toggleComments={toggleComments}
			on:share={handleShare}
			on:history={handleHistory}
			on:back={handleBack}
			on:nameChange={handleNameChange}
			on:themeChange={handleThemeChange}
		/>

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

				<!-- Comments Panel - Snapped to right edge -->
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

	/* Responsive: stack on mobile */
	@media (max-width: 1024px) {
		.workshop-flex {
			flex-direction: column;
		}

		.workshop-comments {
			width: 100%;
			position: static;
			height: 500px;
			overflow: hidden;
		}
	}
</style>
