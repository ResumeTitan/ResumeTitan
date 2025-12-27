<script lang="ts">
	/**
	 * ShareModal
	 *
	 * Modal for managing workshop sharing settings.
	 */
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import Modal from '$components/ui/Modal.svelte';
	import Button from '$components/ui/Button.svelte';
	import Spinner from '$components/ui/Spinner.svelte';

	export let isOpen = false;
	export let workshopId: string;
	export let workshopName: string;
	export let shareEnabled = false;
	export let shareToken: string | undefined = undefined;

	let loading = false;
	let copied = false;
	let error = '';

	const dispatch = createEventDispatcher<{
		close: void;
		toggle: { enabled: boolean };
	}>();

	$: shareUrl = shareToken ? `${window.location.origin}/workshop/shared/${shareToken}` : '';

	async function handleToggle() {
		loading = true;
		error = '';
		try {
			dispatch('toggle', { enabled: !shareEnabled });
		} catch (e: any) {
			error = e?.message || 'Failed to update sharing settings';
		} finally {
			loading = false;
		}
	}

	async function copyToClipboard() {
		if (!shareUrl) return;

		try {
			await navigator.clipboard.writeText(shareUrl);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (e) {
			// Fallback for older browsers
			const textArea = document.createElement('textarea');
			textArea.value = shareUrl;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand('copy');
			document.body.removeChild(textArea);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		}
	}

	function handleClose() {
		dispatch('close');
	}
</script>

<Modal open={isOpen} title="Share Workshop" on:close={handleClose}>
	<div class="space-y-6">
		<!-- Workshop Name -->
		<div>
			<p class="text-sm text-gray-500">Sharing settings for</p>
			<p class="font-medium text-lg">{workshopName}</p>
		</div>

		<!-- Toggle Switch -->
		<div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
			<div>
				<p class="font-medium">Enable sharing</p>
				<p class="text-sm text-gray-500">
					Allow others to view and comment on this workshop
				</p>
			</div>
			<button
				type="button"
				class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-main-green focus:ring-offset-2"
				class:bg-main-green={shareEnabled}
				class:bg-gray-200={!shareEnabled}
				on:click={handleToggle}
				disabled={loading}
				role="switch"
				aria-checked={shareEnabled}
			>
				<span
					class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
					class:translate-x-5={shareEnabled}
					class:translate-x-0={!shareEnabled}
				/>
			</button>
		</div>

		<!-- Share URL -->
		{#if shareEnabled && shareUrl}
			<div class="space-y-2" transition:fly={{ y: -10, duration: 200 }}>
				<label for="share-url" class="block text-sm font-medium text-gray-700">
					Share link
				</label>
				<div class="flex gap-2">
					<input
						id="share-url"
						type="text"
						value={shareUrl}
						readonly
						class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-main-green"
					/>
					<Button
						variant="primary"
						size="sm"
						on:click={copyToClipboard}
					>
						{#if copied}
							<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							Copied!
						{:else}
							<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
							</svg>
							Copy
						{/if}
					</Button>
				</div>
				<p class="text-xs text-gray-500">
					Anyone with this link can view your resume and add comments (they must be logged in).
				</p>
			</div>
		{/if}

		<!-- Sharing Disabled Message -->
		{#if !shareEnabled}
			<div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
				<div class="flex">
					<svg class="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
					<p class="text-sm text-yellow-700">
						Sharing is currently disabled. Enable sharing to get a shareable link.
					</p>
				</div>
			</div>
		{/if}

		<!-- Error Message -->
		{#if error}
			<div class="p-4 bg-red-50 border border-red-200 rounded-lg">
				<p class="text-sm text-red-700">{error}</p>
			</div>
		{/if}

		<!-- Loading Indicator -->
		{#if loading}
			<div class="flex justify-center py-2">
				<Spinner size="sm" />
			</div>
		{/if}
	</div>

	<svelte:fragment slot="footer">
		<Button variant="secondary" on:click={handleClose}>Close</Button>
	</svelte:fragment>
</Modal>