<script lang="ts">
	/**
	 * CommentThread
	 *
	 * Displays a single comment with its replies, author info, timestamp,
	 * and actions like reply and resolve.
	 */
	import { createEventDispatcher } from 'svelte';
	import type { WorkshopComment, WorkshopUser } from '$types';
	import CommentInput from './CommentInput.svelte';

	export let comment: WorkshopComment;
	export let currentUser: WorkshopUser;

	let showReplyInput = false;
	let replyInputComponent: CommentInput;

	const dispatch = createEventDispatcher<{
		reply: { commentId: string; text: string };
		resolve: { commentId: string };
		unresolve: { commentId: string };
	}>();

	function formatTimestamp(date: Date): string {
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);

		if (minutes < 1) return 'Just now';
		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		if (days < 7) return `${days}d ago`;
		return date.toLocaleDateString();
	}

	function handleReply(event: CustomEvent<{ text: string }>) {
		dispatch('reply', { commentId: comment.id, text: event.detail.text });
		showReplyInput = false;
	}

	function toggleResolve() {
		if (comment.resolved) {
			dispatch('unresolve', { commentId: comment.id });
		} else {
			dispatch('resolve', { commentId: comment.id });
		}
	}

	function toggleReplyInput() {
		showReplyInput = !showReplyInput;
		if (showReplyInput) {
			// Focus the input after it renders
			setTimeout(() => replyInputComponent?.focus(), 0);
		}
	}
</script>

<div class="comment-thread" class:resolved={comment.resolved}>
	<!-- Main Comment -->
	<div class="flex gap-3">
		<!-- Author Avatar -->
		<div
			class="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-medium text-white"
			style="background-color: {comment.authorColor}"
		>
			{comment.authorInitials}
		</div>

		<!-- Comment Content -->
		<div class="flex-1 min-w-0">
			<!-- Header -->
			<div class="flex items-center gap-2 flex-wrap">
				<span class="font-medium text-sm text-gray-900">{comment.authorName}</span>
				<span class="text-xs text-gray-400">{formatTimestamp(new Date(comment.timestamp))}</span>
				{#if comment.section}
					<span class="text-xs text-main-green bg-lighter-green px-2 py-0.5 rounded">
						{comment.section}
					</span>
				{/if}
			</div>

			<!-- Comment Text -->
			<p class="text-sm text-gray-700 mt-1" class:line-through={comment.resolved} class:text-gray-400={comment.resolved}>
				{comment.text}
			</p>

			<!-- Actions -->
			<div class="flex items-center gap-3 mt-2">
				<button
					class="text-xs text-gray-500 hover:text-main-green transition-colors flex items-center gap-1"
					on:click={toggleReplyInput}
				>
					<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
					</svg>
					Reply
				</button>

				<button
					class="text-xs text-gray-500 hover:text-main-green transition-colors flex items-center gap-1"
					on:click={toggleResolve}
				>
					{#if comment.resolved}
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
						Reopen
					{:else}
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
						Resolve
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- Replies -->
	{#if comment.replies && comment.replies.length > 0}
		<div class="replies ml-11 mt-3 space-y-3 border-l-2 border-gray-100 pl-4">
			{#each comment.replies as reply (reply.id)}
				<div class="flex gap-3">
					<!-- Reply Author Avatar -->
					<div
						class="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-medium text-white"
						style="background-color: {reply.authorColor}"
					>
						{reply.authorInitials}
					</div>

					<!-- Reply Content -->
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2">
							<span class="font-medium text-xs text-gray-900">{reply.authorName}</span>
							<span class="text-xs text-gray-400">{formatTimestamp(new Date(reply.timestamp))}</span>
						</div>
						<p class="text-sm text-gray-700 mt-0.5">{reply.text}</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Reply Input -->
	{#if showReplyInput}
		<div class="ml-11 mt-3">
			<CommentInput
				bind:this={replyInputComponent}
				{currentUser}
				placeholder="Write a reply..."
				buttonText="Reply"
				autofocus={true}
				on:submit={handleReply}
			/>
		</div>
	{/if}
</div>

<style>
	.comment-thread {
		padding: 1rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.comment-thread:last-child {
		border-bottom: none;
	}

	.comment-thread.resolved {
		background-color: #f9fafb;
	}
</style>
