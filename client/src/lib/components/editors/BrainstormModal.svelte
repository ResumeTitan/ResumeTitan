<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from '$components/ui/Modal.svelte';
	import Button from '$components/ui/Button.svelte';

	export let open = false;
	export let placeholder = '';
	export let loading = false;

	let input = '';

	const dispatch = createEventDispatcher<{
		submit: string;
		cancel: void;
	}>();

	function handleSubmit() {
		if (input.trim()) {
			dispatch('submit', input);
			input = '';
		}
	}

	function handleCancel() {
		input = '';
		open = false;
		dispatch('cancel');
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSubmit();
		}
	}
</script>

<Modal bind:open title="Brainstorm Ideas" size="md" on:close={handleCancel}>
	<div class="space-y-4">
		<p class="text-gray-600">
			Tell us about your experience, and AI will help generate bullet points for your highlights.
		</p>

		<div>
			<label for="brainstorm-input" class="form-label-text block mb-2">
				Your Experience
			</label>
			<textarea
				id="brainstorm-input"
				bind:value={input}
				{placeholder}
				rows="5"
				class="form-style w-full"
				on:keydown={handleKeydown}
				disabled={loading}
			></textarea>
		</div>

		<div class="bg-gray-50 p-3 rounded-lg">
			<p class="text-sm text-gray-600">
				<strong>Examples:</strong>
			</p>
			<ul class="text-sm text-gray-500 list-disc list-inside mt-1 space-y-1">
				<li>Led a team of 5 developers to deliver a new feature</li>
				<li>Improved website performance by optimizing database queries</li>
				<li>Created training materials for new employees</li>
			</ul>
		</div>
	</div>

	<div slot="footer" class="flex justify-end gap-2">
		<Button variant="ghost" on:click={handleCancel} disabled={loading}>
			Cancel
		</Button>
		<Button variant="primary" on:click={handleSubmit} {loading} disabled={!input.trim()}>
			{loading ? 'Generating...' : 'Generate Highlights'}
		</Button>
	</div>
</Modal>
