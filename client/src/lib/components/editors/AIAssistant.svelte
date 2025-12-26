<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Button from '$components/ui/Button.svelte';
	import { ANIMATION_TIMING } from '$config';

	export let suggestions: readonly string[] = [];
	export let message = '';
	export let loading = false;

	const dispatch = createEventDispatcher<{
		submit: string;
		close: void;
	}>();

	let placeholderIndex = 0;
	let isPlaceholderFading = false;
	let currentPlaceholder = suggestions[0] || '';

	// Rotate through placeholder suggestions
	onMount(() => {
		if (suggestions.length <= 1) return;

		const interval = setInterval(() => {
			isPlaceholderFading = true;

			setTimeout(() => {
				placeholderIndex = (placeholderIndex + 1) % suggestions.length;
				currentPlaceholder = suggestions[placeholderIndex];
				isPlaceholderFading = false;
			}, ANIMATION_TIMING.PLACEHOLDER_FADE);
		}, ANIMATION_TIMING.PLACEHOLDER_ROTATION);

		return () => clearInterval(interval);
	});

	function handleSubmit() {
		if (message.trim()) {
			dispatch('submit', message);
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSubmit();
		}
	}
</script>

<div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
	<div class="flex items-center justify-between mb-3">
		<h4 class="font-medium text-gray-900 flex items-center gap-2">
			<svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
				/>
			</svg>
			AI Assistant
		</h4>

		<button
			type="button"
			class="text-gray-400 hover:text-gray-600"
			on:click={() => dispatch('close')}
			aria-label="Close AI Assistant"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	</div>

	<div class="relative">
		<textarea
			bind:value={message}
			placeholder={currentPlaceholder}
			rows="3"
			class="form-style w-full transition-opacity duration-300"
			class:opacity-50={isPlaceholderFading}
			on:keydown={handleKeydown}
			disabled={loading}
		></textarea>
	</div>

	<div class="flex justify-end gap-2 mt-3">
		<Button variant="ghost" size="sm" on:click={() => dispatch('close')} disabled={loading}>
			Cancel
		</Button>
		<Button variant="primary" size="sm" on:click={handleSubmit} {loading} disabled={!message.trim()}>
			{loading ? 'Processing...' : 'Submit'}
		</Button>
	</div>

	<p class="text-xs text-gray-500 mt-2">
		Tip: Be specific about what you want to improve. For example, "{suggestions[0] || 'Add metrics to the first highlight'}"
	</p>
</div>
