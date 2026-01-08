<script lang="ts">
    import { createEventDispatcher, setContext } from 'svelte';
    import { writable } from 'svelte/store';

    export let tabs: Array<{ id: string; label: string; disabled?: boolean }> = [];
    export let activeTab = '';
    export let variant: 'default' | 'underline' | 'pills' = 'underline';

    const dispatch = createEventDispatcher<{ change: string }>();

    // Create a store for the active tab
    const activeTabStore = writable(activeTab);
    $: activeTabStore.set(activeTab);

    // Provide context to child components
    setContext('tabs', { activeTab: activeTabStore });

    function selectTab(tabId: string) {
        if (tabs.find(t => t.id === tabId)?.disabled) return;
        activeTab = tabId;
        dispatch('change', tabId);
    }

    // Set first tab as active if none specified
    $: if (!activeTab && tabs.length > 0) {
        activeTab = tabs[0].id;
    }

    // Calculate indicator position
    $: activeIndex = tabs.findIndex(t => t.id === activeTab);
</script>

<div class="tabs-container">
    <!-- Tab List -->
    <div class="tabs-list" class:tabs-underline={variant === 'underline'} class:tabs-pills={variant === 'pills'} role="tablist">
        {#each tabs as tab, index (tab.id)}
            <button
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls="tabpanel-{tab.id}"
                id="tab-{tab.id}"
                class="tab-btn"
                class:tab-btn-active={activeTab === tab.id}
                class:tab-btn-disabled={tab.disabled}
                disabled={tab.disabled}
                on:click={() => selectTab(tab.id)}
            >
                {tab.label}
            </button>
        {/each}

        <!-- Animated indicator for underline variant -->
        {#if variant === 'underline' && activeIndex >= 0}
            <div class="tab-indicator" style="width: {100 / tabs.length}%; transform: translateX({activeIndex * 100}%);"></div>
        {/if}
    </div>

    <!-- Tab Panels -->
    <div class="tabs-content">
        <slot {activeTab} />
    </div>
</div>
