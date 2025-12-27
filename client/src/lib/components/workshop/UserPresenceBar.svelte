<script lang="ts">
	/**
	 * UserPresenceBar
	 *
	 * Displays a row of user avatars showing who is currently in the workshop.
	 * Shows online status with green dots and active status with a smaller indicator.
	 */
	import type { WorkshopUser } from '$types';

	export let users: WorkshopUser[] = [];
	export let maxVisible = 4;

	$: visibleUsers = users.slice(0, maxVisible);
	$: hiddenCount = Math.max(0, users.length - maxVisible);
	$: activeCount = users.filter((u) => u.isActive).length;
</script>

<div class="user-presence-bar flex items-center gap-2">
	<!-- User Avatars -->
	<div class="flex -space-x-2">
		{#each visibleUsers as user (user.clerkId)}
			<div class="relative" title="{user.name} {user.isOnline ? '(online)' : '(offline)'}">
				<!-- Avatar -->
				<div
					class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white"
					style="background-color: {user.color}"
				>
					{#if user.avatar}
						<img src={user.avatar} alt={user.name} class="w-full h-full rounded-full object-cover" />
					{:else}
						{user.initials}
					{/if}
				</div>

				<!-- Online Indicator -->
				{#if user.isOnline}
					<span
						class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
						class:bg-green-500={user.isOnline}
						class:bg-gray-400={!user.isOnline}
					>
						<!-- Active indicator (smaller dot inside) -->
						{#if user.isActive}
							<span class="absolute inset-0 flex items-center justify-center">
								<span class="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
							</span>
						{/if}
					</span>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Hidden count badge -->
	{#if hiddenCount > 0}
		<div
			class="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600"
		>
			+{hiddenCount}
		</div>
	{/if}

	<!-- Active users indicator -->
	{#if activeCount > 0}
		<span class="text-sm text-gray-500 ml-2">
			{activeCount} active
		</span>
	{/if}
</div>

<style>
	.user-presence-bar {
		/* Container styles */
	}

	/* Hide "X active" text on mobile */
	@media (max-width: 768px) {
		.user-presence-bar span:last-child {
			display: none;
		}
	}
</style>
