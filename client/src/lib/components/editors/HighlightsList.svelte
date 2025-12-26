<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { flip } from 'svelte/animate';
	import Button from '$components/ui/Button.svelte';

	export let label = 'Highlights';
	export let placeholder = 'Enter a highlight...';
	export let highlights: string[] = [];
	export let disabled = false;

	const dispatch = createEventDispatcher<{
		add: void;
		change: { index: number; value: string };
		delete: number;
		reorder: { from: number; to: number };
		aiAssist: void;
		brainstorm: void;
	}>();

	let draggedIndex: number | null = null;

	function handleInput(index: number, event: Event) {
		const target = event.target as HTMLTextAreaElement;
		dispatch('change', { index, value: target.value });
	}

	function handleAdd() {
		dispatch('add');
	}

	function handleDelete(index: number) {
		dispatch('delete', index);
	}

	function handleDragStart(index: number) {
		draggedIndex = index;
	}

	function handleDragOver(event: DragEvent, index: number) {
		event.preventDefault();
		if (draggedIndex !== null && draggedIndex !== index) {
			dispatch('reorder', { from: draggedIndex, to: index });
			draggedIndex = index;
		}
	}

	function handleDragEnd() {
		draggedIndex = null;
	}
</script>

<div class="w-full">
	<div class="flex items-center justify-between mb-4">
		<h3 class="form-label-text">{label}</h3>
		<div class="flex gap-2">
			<Button variant="ghost" size="sm" on:click={() => dispatch('brainstorm')} {disabled}>
				Brainstorm
			</Button>
			<Button variant="ghost" size="sm" on:click={() => dispatch('aiAssist')} {disabled}>
				AI Assist
			</Button>
		</div>
	</div>

	<div class="space-y-3">
		{#each highlights as highlight, index (index)}
			<div
				class="flex gap-2 items-start group"
				animate:flip={{ duration: 200 }}
				draggable="true"
				on:dragstart={() => handleDragStart(index)}
				on:dragover={(e) => handleDragOver(e, index)}
				on:dragend={handleDragEnd}
				role="listitem"
			>
				<!-- Drag handle -->
				<button
					type="button"
					class="mt-3 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
					aria-label="Drag to reorder"
				>
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
						<path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
					</svg>
				</button>

				<!-- Highlight text -->
				<textarea
					value={highlight}
					{placeholder}
					{disabled}
					rows="2"
					class="form-style flex-1 resize-y"
					on:input={(e) => handleInput(index, e)}
				></textarea>

				<!-- Delete button -->
				<button
					type="button"
					class="mt-3 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
					on:click={() => handleDelete(index)}
					{disabled}
					aria-label="Delete highlight"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
						/>
					</svg>
				</button>
			</div>
		{/each}
	</div>

	<div class="mt-4">
		<Button variant="ghost" size="sm" on:click={handleAdd} {disabled}>
			+ Add Highlight
		</Button>
	</div>
</div>
