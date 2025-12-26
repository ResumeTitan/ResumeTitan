<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { workshopApi, resumeApi } from '$api';
	import { isAuthenticated, authStore } from '$stores';
	import type { ResumeType } from '$types';
	import Button from '$components/ui/Button.svelte';
	import Spinner from '$components/ui/Spinner.svelte';

	let resumes: ResumeType[] = [];
	let loading = true;
	let error = '';
	let hasLoaded = false;
	let selectedResumeId = '';
	let isCreating = false;

	onMount(async () => {
		if (!$isAuthenticated) {
			authStore.openAuthModal();
			return;
		}

		await loadResumes();
	});

	$: if ($isAuthenticated && !hasLoaded) {
		loadResumes();
	}

	async function loadResumes() {
		if (hasLoaded) return;
		hasLoaded = true;
		loading = true;
		error = '';

		try {
			const response = await resumeApi.getByUser($authStore.userId);
			resumes = response.resumes || [];
		} catch (e) {
			console.error('Failed to load resumes:', e);
			error = 'Unable to load your resumes. Please try again.';
		} finally {
			loading = false;
		}
	}

	function selectResume(id: string) {
		selectedResumeId = id;
		error = '';
	}

	async function createWorkshop() {
		if (!selectedResumeId) {
			error = 'Please select a resume to start a workshop.';
			return;
		}

		if (isCreating) return;
		isCreating = true;
		error = '';

		try {
			const selectedResume = resumes.find((resume) => resume._id === selectedResumeId);
			const name = selectedResume?.name || 'Workshop';
			const { workshop: newWorkshop } = await workshopApi.create({
				resumeId: selectedResumeId,
				name
			});
			goto(`/workshop/${newWorkshop._id}`);
		} catch (e) {
			console.error('Failed to create workshop:', e);
			error = 'Failed to create workshop. Please try again.';
		} finally {
			isCreating = false;
		}
	}
</script>

<div class="page-container">
	<div class="page-header max-w-4xl mx-auto">
		<h1 class="text-3xl font-bold mb-2">Start a Workshop</h1>
		<p class="text-gray-600 mb-6">Choose a resume to attach to your workshop.</p>

		{#if loading}
			<div class="flex justify-center py-20">
				<Spinner size="lg" />
			</div>
		{:else if error}
			<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
				{error}
			</div>
		{:else if resumes.length === 0}
			<div class="bg-white border border-gray-200 rounded-lg p-6 text-center">
				<p class="text-gray-600 mb-4">You need a resume before starting a workshop.</p>
				<a href="/resume">
					<Button>Create a Resume</Button>
				</a>
			</div>
		{:else}
			<div class="space-y-3 mb-6">
				{#each resumes as resume (resume._id)}
					<button
						type="button"
						class="w-full text-left border rounded-lg p-4 transition
							{selectedResumeId === resume._id
							? 'border-main-green bg-lightest-green'
							: 'border-gray-200 hover:border-main-green'}"
						on:click={() => selectResume(resume._id)}
					>
						<div class="flex items-center justify-between">
							<div>
								<p class="font-medium">{resume.name || 'Untitled Resume'}</p>
								<p class="text-sm text-gray-500">
									{resume.basics?.name || 'No name set'}
								</p>
							</div>
							<div
								class="w-5 h-5 rounded-full border flex items-center justify-center
									{selectedResumeId === resume._id
									? 'border-main-green bg-main-green'
									: 'border-gray-300'}"
							>
								{#if selectedResumeId === resume._id}
									<span class="block w-2 h-2 bg-white rounded-full"></span>
								{/if}
							</div>
						</div>
					</button>
				{/each}
			</div>

			<div class="flex justify-end">
				<Button on:click={createWorkshop} disabled={!selectedResumeId || isCreating}>
					{isCreating ? 'Creating...' : 'Create Workshop'}
				</Button>
			</div>
		{/if}
	</div>
</div>
