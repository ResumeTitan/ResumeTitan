<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$stores/auth';
	import { api } from '$lib/api/client';

	onMount(async () => {
		// Reload user to get updated subscription status
		try {
			const response = await api.get<{ userId?: string }>('/auth/reload');
			if (response.userId) {
				authStore.setUserId(response.userId);
			}
		} catch (error) {
			console.error('Error reloading user:', error);
		}

		// Redirect to dashboard after 3 seconds
		setTimeout(() => {
			goto('/dashboard');
		}, 3000);
	});
</script>

<svelte:head>
	<title>Success! - ResumeTitan</title>
</svelte:head>

<div
	class="min-h-screen flex items-center justify-center bg-gradient-to-br from-main-green to-dark-green"
>
	<div class="text-center text-white p-8">
		<div class="mb-6">
			<svg
				class="w-24 h-24 mx-auto text-white animate-bounce"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
		</div>
		<h1 class="text-4xl font-bold mb-4">Success!</h1>
		<p class="text-xl text-lightest-green mb-2">Your payment was successful.</p>
		<p class="text-lg text-lightest-green">Taking you to ResumeTitan...</p>

		<div class="mt-8">
			<div class="inline-block">
				<div
					class="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"
				></div>
			</div>
		</div>
	</div>
</div>
