<script lang="ts">
	import type { AlertVariant } from '$types';

	export let variant: AlertVariant = 'info';
	export let dismissible = false;
	export let visible = true;
	export let onDismiss: (() => void) | undefined = undefined;

	const variantClasses: Record<AlertVariant, string> = {
		success: 'bg-green-100 border-green-500 text-green-800',
		error: 'bg-red-100 border-red-500 text-red-800',
		warning: 'bg-yellow-100 border-yellow-500 text-yellow-800',
		info: 'bg-blue-100 border-blue-500 text-blue-800'
	};

	const iconPaths: Record<AlertVariant, string> = {
		success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
		error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
		warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
		info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
	};

	function dismiss() {
		visible = false;
		if (onDismiss) {
			onDismiss();
		}
	}
</script>

{#if visible}
	<div
		class="border-l-4 p-4 rounded-r-lg flex items-start gap-3 {variantClasses[variant]}"
		role="alert"
	>
		<svg
			class="w-5 h-5 flex-shrink-0 mt-0.5"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d={iconPaths[variant]}
			/>
		</svg>

		<div class="flex-1">
			<slot />
		</div>

		{#if dismissible}
			<button
				type="button"
				class="flex-shrink-0 hover:opacity-75 transition-opacity"
				on:click={dismiss}
				aria-label="Dismiss"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		{/if}
	</div>
{/if}
