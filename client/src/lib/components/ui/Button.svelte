<script lang="ts">
    import type { ButtonVariant, ButtonSize } from '$types';

    export let variant: ButtonVariant = 'primary';
    export let size: ButtonSize = 'md';
    export let disabled = false;
    export let loading = false;
    export let type: 'button' | 'submit' | 'reset' = 'button';
    export let fullWidth = false;

    const variantClasses: Record<ButtonVariant, string> = {
        primary: 'bg-white text-teal-800 border-black hover:bg-teal-800 hover:text-white',
        secondary: 'bg-white text-red-700 border-red-500 hover:bg-red-600 hover:text-white hover:border-red-600',
        danger: 'bg-red-600 text-white border-red-600 hover:bg-red-800',
        ghost: 'bg-transparent text-teal-800 border-transparent hover:bg-gray-100',
    };

    const sizeClasses: Record<ButtonSize, string> = {
        sm: 'text-sm px-3 py-1.5',
        md: 'text-lg px-5 py-2.5',
        lg: 'text-xl px-6 py-3',
    };

    $: buttonClasses = [
        'border-2 rounded-lg font-medium transition-all duration-300 ease-in-out m-1 text-center',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        disabled || loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400' : 'hover:cursor-pointer',
    ].join(' ');
</script>

<button {type} disabled={disabled || loading} class={buttonClasses} on:click on:focus on:blur on:mouseenter on:mouseleave {...$$restProps}>
    {#if loading}
        <span class="inline-flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
            Loading...
        </span>
    {:else}
        <slot />
    {/if}
</button>
