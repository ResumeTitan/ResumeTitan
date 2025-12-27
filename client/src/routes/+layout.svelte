<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { isAuthenticated, authStore } from '$stores';
	import NavBar from '$components/layout/NavBar.svelte';
	import Footer from '$components/layout/Footer.svelte';
	import ChatBot from '$components/layout/ChatBot.svelte';
	import { AuthModal } from '$components/auth';
	import { getClerk } from '$lib/utils/clerk.client';
	import '../app.css';

	// Check if current page is a print page
	$: isPrintPage = $page.url.pathname.includes('/print-resume');

	// Get user name from store or empty
	$: userName = $authStore.user?.fullName || $authStore.user?.email || '';

	onMount(async () => {
		const clerk = await getClerk();
		if (!clerk) return;

		// Track if we've ever had a valid session to prevent false logouts
		let hadValidSession = false;

		const syncSession = async () => {
			const session = clerk.session;
			const user = clerk.user;

			if (session && user) {
				hadValidSession = true;
				authStore.setUser({
					id: user.id,
					fullName: user.fullName || undefined,
					email: user.primaryEmailAddress?.emailAddress || undefined
				});

				const token = await session.getToken();
				if (token) {
					authStore.setToken(token);
				}
			} else if (!hadValidSession) {
				// Only clear auth if we never had a valid session
				// This prevents clearing auth when Clerk briefly reports no session
				authStore.clearAuth();
			}
		};

		await syncSession();

		// Debounce timer to prevent rapid auth state changes when switching tabs
		let clearAuthTimeout: ReturnType<typeof setTimeout> | null = null;

		clerk.addListener((resources) => {
			// Clear any pending logout
			if (clearAuthTimeout) {
				clearTimeout(clearAuthTimeout);
				clearAuthTimeout = null;
			}

			if (resources.session && resources.user) {
				hadValidSession = true;
				authStore.setUser({
					id: resources.user.id,
					fullName: resources.user.fullName || undefined,
					email: resources.user.primaryEmailAddress?.emailAddress || undefined
				});
				resources.session.getToken().then((token) => {
					if (token) {
						authStore.setToken(token);
					}
				});
				return;
			}

			// Debounce the clearAuth call - wait 500ms to ensure it's a real logout
			// not just a temporary state when switching browser tabs
			clearAuthTimeout = setTimeout(() => {
				// Double-check there's still no session before clearing
				if (!clerk.session) {
					authStore.clearAuth();
				}
			}, 500);
		});
	});
</script>

<svelte:head>
	<title>ResumeTitan - AI-Powered Resume Builder</title>
	<meta name="description" content="Create professional resumes with AI assistance. Build, customize, and export your resume in minutes." />
</svelte:head>

<div class="min-h-screen flex flex-col">
	{#if !isPrintPage}
		<NavBar isAuthenticated={$isAuthenticated} {userName} />
	{/if}

	<main class="flex-1">
		<slot />
	</main>

	{#if !isPrintPage}
		<Footer />
		<ChatBot />
	{/if}

	<!-- Auth Modal (appears on any page when triggered) -->
	<AuthModal />
</div>
