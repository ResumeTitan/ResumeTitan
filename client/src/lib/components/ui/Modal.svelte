<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	export let open = true;
	export let title = '';
	export let size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
	export let closeOnBackdrop = true;
	export let closeOnEscape = true;
	export let onClose: (() => void) | undefined = undefined;

	const dispatch = createEventDispatcher<{ close: void }>();

	const sizeClasses: Record<string, string> = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		full: 'max-w-4xl'
	};

	function close() {
		open = false;
		dispatch('close');
		if (onClose) {
			onClose();
		}
	}

	function handleBackdropClick() {
		if (closeOnBackdrop) {
			close();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && closeOnEscape) {
			close();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
		transition:fade={{ duration: 150 }}
		on:click={handleBackdropClick}
		on:keydown={(e) => e.key === 'Enter' && handleBackdropClick()}
		role="button"
		tabindex="0"
		aria-label="Close modal"
	>
		<!-- Modal Content -->
		<div
			class="bg-white rounded-lg shadow-xl w-full {sizeClasses[size]} max-h-[90vh] overflow-hidden flex flex-col"
			transition:scale={{ duration: 150, start: 0.95 }}
			on:click|stopPropagation
			on:keydown|stopPropagation
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? 'modal-title' : undefined}
			tabindex="-1"
		>
			<!-- Header -->
			{#if title || $$slots.header}
				<div class="flex items-center justify-between p-4 border-b border-gray-200">
					{#if $$slots.header}
						<slot name="header" />
					{:else}
						<h2 id="modal-title" class="text-xl font-semibold text-gray-900">
							{title}
						</h2>
					{/if}

					<button
						type="button"
						class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
						on:click={close}
						aria-label="Close"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
			{/if}

			<!-- Body -->
			<div class="p-4 overflow-y-auto flex-1">
				<slot />
			</div>

			<!-- Footer -->
			{#if $$slots.footer}
				<div class="p-4 border-t border-gray-200 bg-gray-50">
					<slot name="footer" />
				</div>
			{/if}
		</div>
	</div>
{/if}
