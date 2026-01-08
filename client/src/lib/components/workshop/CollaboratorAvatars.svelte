<script lang="ts">
    import { presenceStore } from '$lib/stores/presence';
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';

    let currentUserId = $state('');

    onMount(async () => {
        if (browser) {
            // Get current user ID from Clerk
            const { getClerk } = await import('$lib/utils/clerk.client');
            const clerk = await getClerk();
            if (clerk?.user) {
                currentUserId = clerk.user.id;
            }
        }
    });

    // Get online participants from the store, excluding current user, sorted by active status (active first)
    const participants = $derived(
        $presenceStore.participants
            .filter(p => p.isOnline && p.userId !== currentUserId)
            .sort((a, b) => {
                // Active users first
                if (a.isActive && !b.isActive) return -1;
                if (!a.isActive && b.isActive) return 1;
                return 0;
            })
    );
</script>

<div class="collaborator-avatars">
    {#each participants as participant (participant.userId)}
        <div
            class="avatar-wrapper"
            title="{participant.userName} ({participant.isActive ? 'Active' : 'Idle'})"
        >
            {#if participant.userAvatar}
                <img
                    src={participant.userAvatar}
                    alt={participant.userName}
                    class="avatar-image"
                    style="border-color: {participant.color}"
                />
            {:else}
                <div
                    class="avatar-initials"
                    style="background-color: {participant.color}"
                >
                    {participant.initials}
                </div>
            {/if}

            <!-- Online/Active indicator -->
            {#if participant.isActive}
                <span class="status-dot active" title="Active"></span>
            {:else if participant.isOnline}
                <span class="status-dot idle" title="Idle"></span>
            {/if}
        </div>
    {/each}
</div>

<style>
    .collaborator-avatars {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .avatar-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .avatar-image,
    .avatar-initials {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 600;
        color: white;
        border: 2px solid transparent;
        transition: transform 0.2s ease;
    }

    .avatar-image {
        object-fit: cover;
    }

    .avatar-wrapper:hover .avatar-image,
    .avatar-wrapper:hover .avatar-initials {
        transform: scale(1.1);
        z-index: 10;
    }

    .status-dot {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 50%;
        border: 2.5px solid white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
    }

    .status-dot.active {
        background-color: #10B981; /* bright green */
        animation: pulse 2s infinite;
    }

    .status-dot.idle {
        background-color: #9CA3AF; /* gray */
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.7;
            transform: scale(1.1);
        }
    }
</style>
