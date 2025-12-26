<script lang="ts">
	export let text = '';
	export let position: 'top' | 'bottom' | 'left' | 'right' = 'top';
	export let delay = 300;

	let visible = false;
	let timeoutId: ReturnType<typeof setTimeout>;

	const positionClasses: Record<string, string> = {
		top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
		bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
		left: 'right-full top-1/2 -translate-y-1/2 mr-2',
		right: 'left-full top-1/2 -translate-y-1/2 ml-2'
	};

	const arrowClasses: Record<string, string> = {
		top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 border-x-transparent border-b-transparent',
		bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 border-x-transparent border-t-transparent',
		left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-900 border-y-transparent border-r-transparent',
		right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-900 border-y-transparent border-l-transparent'
	};

	function show() {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			visible = true;
		}, delay);
	}

	function hide() {
		clearTimeout(timeoutId);
		visible = false;
	}
</script>

<div
	class="relative inline-block"
	on:mouseenter={show}
	on:mouseleave={hide}
	on:focus={show}
	on:blur={hide}
	role="tooltip"
>
	<slot />

	{#if visible && text}
		<div
			class="absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded whitespace-nowrap {positionClasses[position]}"
		>
			{text}
			<div class="absolute w-0 h-0 border-4 {arrowClasses[position]}"></div>
		</div>
	{/if}
</div>
