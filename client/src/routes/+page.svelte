<script lang="ts">
    import Button from '$components/ui/Button.svelte';
    import { authStore } from '$stores';

    function openLogin() {
        authStore.openAuthModal();
    }
</script>

<svelte:head>
    <title>ResumeTitan - AI-Powered Resume Builder</title>
</svelte:head>

<!-- Hero Section -->
<section class="bg-main-green text-white py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
            <h1 class="text-4xl md:text-6xl font-bold mb-6 animate-slideUpFadeIn">Build Your Perfect Resume with AI</h1>
            <p class="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                Create professional, ATS-friendly resumes in minutes. Our AI helps you craft compelling content that stands out.
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" on:click={openLogin}>Get Started Free</Button>
                <a href="/docs">
                    <Button variant="ghost" size="lg">
                        <span
                            class="text-white border-2 border-white px-6 py-3 rounded-lg hover:bg-white hover:text-main-green transition-colors"
                        >
                            Learn More
                        </span>
                    </Button>
                </a>
            </div>
        </div>
    </div>
</section>

<!-- Features Section -->
<section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">Why Choose ResumeTitan?</h2>

        <div class="grid md:grid-cols-3 gap-8">
            <!-- Feature 1 -->
            <div class="text-center p-6">
                <div class="w-16 h-16 bg-lighter-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-darker-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">AI-Powered Content</h3>
                <p class="text-gray-600">Let AI help you write compelling bullet points and summaries that highlight your achievements.</p>
            </div>

            <!-- Feature 2 -->
            <div class="text-center p-6">
                <div class="w-16 h-16 bg-lighter-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-darker-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                        />
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">Professional Templates</h3>
                <p class="text-gray-600">
                    Choose from 6 beautiful, ATS-friendly templates designed for different industries and career levels.
                </p>
            </div>

            <!-- Feature 3 -->
            <div class="text-center p-6">
                <div class="w-16 h-16 bg-lighter-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-darker-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">Easy Export</h3>
                <p class="text-gray-600">Export your resume as PDF with one click. Perfect formatting every time.</p>
            </div>
        </div>
    </div>
</section>

<!-- Stats Section -->
<section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
                <p class="text-4xl font-bold text-main-green">10K+</p>
                <p class="text-gray-600">Resumes Created</p>
            </div>
            <div>
                <p class="text-4xl font-bold text-main-green">6</p>
                <p class="text-gray-600">Pro Templates</p>
            </div>
            <div>
                <p class="text-4xl font-bold text-main-green">AI</p>
                <p class="text-gray-600">Powered Writing</p>
            </div>
            <div>
                <p class="text-4xl font-bold text-main-green">Free</p>
                <p class="text-gray-600">To Get Started</p>
            </div>
        </div>
    </div>
</section>

<!-- CTA Section -->
<section class="py-20 bg-darker-green text-white">
    <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to Land Your Dream Job?</h2>
        <p class="text-xl mb-8 opacity-90">Join thousands of job seekers who've already created winning resumes with ResumeTitan.</p>
        <Button size="lg" on:click={openLogin}>Create Your Resume Now</Button>
    </div>
</section>
