<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { uiStore, authStore } from '$stores';
    import { getClerk } from '$lib/utils/clerk.client';
    import Button from '$components/ui/Button.svelte';
    import whiteLogo from '$lib/assets/text-logo-white.png';

    export let isAuthenticated = false;
    export let userName = '';

    let isMobileMenuOpen = false;
    let isUserMenuOpen = false;

    const navLinks = [
        { href: '/dashboard', label: 'Dashboard', requiresAuth: true },
        { href: '/docs', label: 'User Guides', requiresAuth: false },
    ];

    function toggleMobileMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;
        uiStore.toggleMobileMenu();
    }

    function closeMobileMenu() {
        isMobileMenuOpen = false;
        uiStore.closeMobileMenu();
    }

    function openLogin() {
        closeMobileMenu();
        authStore.openAuthModal();
    }

    function toggleUserMenu() {
        isUserMenuOpen = !isUserMenuOpen;
    }

    function closeUserMenu() {
        isUserMenuOpen = false;
    }

    async function handleSignOut() {
        closeUserMenu();
        closeMobileMenu();
        const clerk = await getClerk();
        if (clerk) {
            await clerk.signOut();
            authStore.clearAuth();
            goto('/');
        }
    }

    async function openUserProfile() {
        closeUserMenu();
        const clerk = await getClerk();
        if (clerk) {
            clerk.openUserProfile();
        }
    }

    // Close user menu when clicking outside
    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('.user-menu-container')) {
            closeUserMenu();
        }
    }

    $: currentPath = $page.url.pathname;
    $: userInitial = (userName || 'U').charAt(0).toUpperCase();
</script>

<svelte:window on:click={handleClickOutside} />

<nav class="bg-main-green text-white shadow-lg">
    <div class="px-2 mx-10 sm:px-4">
        <div class="flex justify-between items-center h-16">
            <!-- Logo -->
            <div class="flex-shrink-0">
                <a href="/" class="flex items-center gap-2" on:click={closeMobileMenu}>
                    <!-- Replace this img src with your actual logo path -->
                    <img src={whiteLogo} alt="ResumeTitan" class="h-20 w-auto" />
                </a>
            </div>

            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center space-x-4">
                {#each navLinks as link}
                    {#if !link.requiresAuth || isAuthenticated}
                        <a
                            href={link.href}
                            class="px-3 py-2 rounded-md text-sm font-medium transition-colors
								{currentPath === link.href ? 'bg-darker-green' : 'hover:bg-dark-green'}"
                        >
                            {link.label}
                        </a>
                    {/if}
                {/each}

                {#if isAuthenticated}
                    <!-- User Menu Dropdown -->
                    <div class="relative ml-4 user-menu-container">
                        <button
                            type="button"
                            class="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-dark-green transition-colors"
                            on:click|stopPropagation={toggleUserMenu}
                            aria-expanded={isUserMenuOpen}
                            aria-haspopup="true"
                        >
                            <div class="w-8 h-8 rounded-full bg-lighter-green flex items-center justify-center">
                                <span class="text-sm font-medium text-darker-green">
                                    {userInitial}
                                </span>
                            </div>
                            <span class="text-sm hidden lg:inline">{userName || 'User'}</span>
                            <svg
                                class="w-4 h-4 transition-transform {isUserMenuOpen ? 'rotate-180' : ''}"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <!-- Dropdown Menu -->
                        {#if isUserMenuOpen}
                            <div
                                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200"
                                role="menu"
                            >
                                <div class="px-4 py-2 border-b border-gray-100">
                                    <p class="text-sm font-medium text-gray-900">{userName || 'User'}</p>
                                    <p class="text-xs text-gray-500 truncate">{$authStore.user?.email || ''}</p>
                                </div>

                                <button
                                    type="button"
                                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                    on:click={openUserProfile}
                                    role="menuitem"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                        />
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    Account Settings
                                </button>

                                <button
                                    type="button"
                                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    on:click={handleSignOut}
                                    role="menuitem"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                    Sign Out
                                </button>
                            </div>
                        {/if}
                    </div>
                {:else}
                    <div class="flex items-center gap-2 ml-4">
                        <Button variant="ghost" size="sm" on:click={openLogin}>
                            <span class="text-white">Sign In</span>
                        </Button>
                    </div>
                {/if}
            </div>

            <!-- Mobile menu button -->
            <div class="md:hidden">
                <button
                    type="button"
                    class="inline-flex items-center justify-center p-2 rounded-md hover:bg-dark-green focus:outline-none"
                    on:click={toggleMobileMenu}
                    aria-expanded={isMobileMenuOpen}
                    aria-label="Toggle menu"
                >
                    {#if isMobileMenuOpen}
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    {:else}
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    {/if}
                </button>
            </div>
        </div>
    </div>

    <!-- Mobile Navigation -->
    {#if isMobileMenuOpen}
        <div class="md:hidden bg-dark-green">
            <div class="px-2 pt-2 pb-3 space-y-1">
                {#each navLinks as link}
                    {#if !link.requiresAuth || isAuthenticated}
                        <a
                            href={link.href}
                            class="block px-3 py-2 rounded-md text-base font-medium
								{currentPath === link.href ? 'bg-darker-green' : 'hover:bg-darker-green'}"
                            on:click={closeMobileMenu}
                        >
                            {link.label}
                        </a>
                    {/if}
                {/each}

                {#if isAuthenticated}
                    <div class="pt-4 border-t border-darker-green">
                        <div class="px-3 py-2 flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-lighter-green flex items-center justify-center">
                                <span class="text-lg font-medium text-darker-green">
                                    {userInitial}
                                </span>
                            </div>
                            <div>
                                <p class="text-sm font-medium">{userName || 'User'}</p>
                                <p class="text-xs text-gray-300 truncate">{$authStore.user?.email || ''}</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            class="w-full text-left px-3 py-2 mt-2 rounded-md text-base font-medium hover:bg-darker-green flex items-center gap-2"
                            on:click={openUserProfile}
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            Account Settings
                        </button>

                        <button
                            type="button"
                            class="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-300 hover:bg-red-900/30 flex items-center gap-2"
                            on:click={handleSignOut}
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                {:else}
                    <div class="pt-4 pb-2 border-t border-darker-green">
                        <button
                            type="button"
                            class="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-darker-green"
                            on:click={openLogin}
                        >
                            Sign In
                        </button>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</nav>
