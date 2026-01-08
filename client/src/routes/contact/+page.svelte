<script lang="ts">
    import Button from '$components/ui/Button.svelte';
    import FormField from '$components/forms/FormField.svelte';
    import FormArea from '$components/forms/FormArea.svelte';

    let name = '';
    let email = '';
    let message = '';
    let submitted = false;

    function handleSubmit() {
        // In a real app, this would send to an API
        submitted = true;
    }
</script>

<svelte:head>
    <title>Contact Us - ResumeTitan</title>
</svelte:head>

<div class="page-container">
    <div class="max-w-2xl mx-auto px-4 py-12">
        <h1 class="text-4xl font-bold mb-4">Contact Us</h1>
        <p class="text-gray-600 mb-8">Have a question, suggestion, or just want to say hi? We'd love to hear from you.</p>

        {#if submitted}
            <div class="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <svg class="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <h2 class="text-xl font-semibold mb-2">Message Sent!</h2>
                <p class="text-gray-600">Thank you for reaching out. We'll get back to you soon.</p>
            </div>
        {:else}
            <form on:submit|preventDefault={handleSubmit} class="space-y-6">
                <FormField id="name" label="Your Name" bind:value={name} placeholder="John Doe" required />

                <FormField id="email" label="Email Address" type="email" bind:value={email} placeholder="you@example.com" required />

                <FormArea id="message" label="Message" bind:value={message} placeholder="How can we help you?" rows={6} required />

                <Button type="submit" variant="primary" fullWidth>Send Message</Button>
            </form>
        {/if}

        <div class="mt-12 pt-8 border-t border-gray-200">
            <h2 class="text-xl font-semibold mb-4">Other Ways to Reach Us</h2>
            <div class="space-y-3 text-gray-600">
                <p>
                    <strong>Email:</strong> support@resumetitan.com
                </p>
                <p>
                    <strong>Response Time:</strong> We typically respond within 24 hours.
                </p>
            </div>
        </div>
    </div>
</div>
