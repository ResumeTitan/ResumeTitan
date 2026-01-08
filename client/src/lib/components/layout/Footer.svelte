<script lang="ts">
    import { authStore } from '$stores';

    const currentYear = new Date().getFullYear();

    const footerLinks = [
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms of Service' },
    ];

    function openLogin() {
        authStore.openAuthModal();
    }
</script>

<footer class="bg-darkest-green text-white py-8 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Brand -->
            <div>
                <h3 class="text-xl font-bold mb-4">ResumeTitan</h3>
                <p class="text-gray-300 text-sm">AI-powered resume builder to help you land your dream job.</p>
            </div>

            <!-- Links -->
            <div>
                <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
                <ul class="space-y-2">
                    {#each footerLinks as link}
                        <li>
                            <a href={link.href} class="text-gray-300 hover:text-white transition-colors text-sm">
                                {link.label}
                            </a>
                        </li>
                    {/each}
                </ul>
            </div>

            <!-- Contact -->
            <div>
                <h4 class="text-lg font-semibold mb-4">Get Started</h4>
                <p class="text-gray-300 text-sm mb-4">Create your professional resume in minutes with our AI-powered tools.</p>
                <button
                    type="button"
                    on:click={openLogin}
                    class="inline-block bg-main-green hover:bg-dark-green text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                    Get Started Free
                </button>
            </div>
        </div>

        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {currentYear} ResumeTitan. All rights reserved.</p>
        </div>
    </div>
</footer>
