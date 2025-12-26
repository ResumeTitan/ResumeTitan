<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { resumeApi } from '$api';
	import { resumeStore, isAuthenticated, authStore } from '$stores';
	import type { ResumeType } from '$types';

	import Button from '$components/ui/Button.svelte';
	import Spinner from '$components/ui/Spinner.svelte';
	import Alert from '$components/ui/Alert.svelte';
	import ResumeEditorCore from '$components/editors/ResumeEditorCore.svelte';

	let resume: ResumeType | null = null;
	let loading = true;
	let saving = false;
	let error = '';

	$: resumeId = $page.params.id || '';

	onMount(async () => {
		if (!$isAuthenticated) {
			authStore.openAuthModal();
			return;
		}

		if (resumeId) {
			await loadResume();
		}
	});

	// Watch for authentication changes and load resume when user logs in
	$: if ($isAuthenticated && resumeId && loading && !resume) {
		loadResume();
	}

	async function loadResume() {
		if (!resumeId) return;
		loading = true;
		error = '';

		try {
			const response = await resumeApi.getById(resumeId);
			resume = response.resume;
			resumeStore.set(resume);
		} catch (e) {
			error = 'Failed to load resume. Please try again.';
			console.error(e);
		} finally {
			loading = false;
		}
	}

	async function saveResume() {
		if (!resume) return;

		saving = true;
		try {
			await resumeApi.update(resume);
			resumeStore.markSaved();
		} catch (e) {
			error = 'Failed to save resume. Please try again.';
		} finally {
			saving = false;
		}
	}

	function handlePrint() {
		goto(`/print-resume/${resumeId}`);
	}

	function handleResumeChange(event: CustomEvent<{ field: string; value: any }>) {
		// Resume is already updated via binding, but we can track changes here
		resumeStore.set(resume!);
	}
</script>

<svelte:head>
	<title>{resume?.name || 'Resume'} - ResumeTitan</title>
</svelte:head>

<div class="page-container">
	{#if loading}
		<div class="flex items-center justify-center py-20">
			<Spinner size="lg" />
		</div>
	{:else if error}
		<div class="max-w-4xl mx-auto p-4">
			<Alert variant="error">{error}</Alert>
		</div>
	{:else if resume}
		<div class="page-header max-w-7xl mx-auto">
			<!-- Header -->
			<div class="flex flex-wrap items-center justify-between gap-4 mb-6">
				<div>
					<input
						type="text"
						value={resume.name}
						on:input={(e) => {
							if (resume) resume.name = e.currentTarget.value;
						}}
						class="text-2xl font-bold bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-main-green focus:outline-none px-1"
						placeholder="Resume Name"
					/>
				</div>
				<div class="flex gap-2">
					<Button variant="ghost" on:click={() => goto('/dashboard')}>
						Back to Dashboard
					</Button>
					<Button variant="primary" on:click={handlePrint}>
						Print / PDF
					</Button>
					<Button variant="primary" loading={saving} on:click={saveResume}>
						{saving ? 'Saving...' : 'Save'}
					</Button>
				</div>
			</div>

			<!-- Main Content -->
			<ResumeEditorCore bind:resume on:change={handleResumeChange} />
		</div>
	{/if}
</div>
