<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { resumeApi } from '$api';
    import { isAuthenticated, authStore } from '$stores';
    import Spinner from '$components/ui/Spinner.svelte';

    let hasCreated = false;

    async function createResume() {
        if (hasCreated) return;
        hasCreated = true;

        try {
            const newResume = await resumeApi.create({});
            goto(`/resume/${newResume._id}`);
        } catch (e) {
            console.error('Failed to create resume:', e);
            goto('/dashboard');
        }
    }

    onMount(() => {
        if (!$isAuthenticated) {
            authStore.openAuthModal();
            return;
        }

        createResume();
    });

    // Watch for authentication changes and create resume when user logs in
    $: if ($isAuthenticated && !hasCreated) {
        createResume();
    }
</script>

<div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
        <Spinner size="lg" />
        <p class="mt-4 text-gray-600">Creating your resume...</p>
    </div>
</div>
