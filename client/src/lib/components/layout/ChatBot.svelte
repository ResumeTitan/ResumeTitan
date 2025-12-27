<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { chatApi } from '$api';
    import { isAuthenticated } from '$stores';
    import { CHATBOT_CONFIG } from '$config';
    import Button from '$components/ui/Button.svelte';
    import Spinner from '$components/ui/Spinner.svelte';

    interface Message {
        id: string;
        role: 'user' | 'assistant';
        content: string;
    }

    let isOpen = false;
    let input = '';
    let messages: Message[] = [];
    let loading = false;
    let messagesContainer: HTMLDivElement;

    $: canSend = input.trim().length > 0 && input.length <= CHATBOT_CONFIG.MAX_CHARS && !loading;

    function toggleChat() {
        isOpen = !isOpen;
    }

    function scrollToBottom() {
        if (messagesContainer) {
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 50);
        }
    }

    async function sendMessage() {
        if (!canSend) return;
        if (!$isAuthenticated) {
            messages = [
                ...messages,
                {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: 'Please sign in to use the AI assistant.',
                },
            ];
            return;
        }

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: 'user',
            content: input.trim(),
        };

        messages = [...messages, userMessage];
        input = '';
        loading = true;
        scrollToBottom();

        try {
            const response = await chatApi.send({
                message: userMessage.content,
                history: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
            });

            const assistantMessage: Message = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: response.response || response.message || 'Sorry, I could not process that request.',
            };

            messages = [...messages, assistantMessage];

            // Limit message history
            if (messages.length > CHATBOT_CONFIG.MAX_MESSAGES) {
                messages = messages.slice(-CHATBOT_CONFIG.MAX_MESSAGES);
            }
        } catch (error) {
            messages = [
                ...messages,
                {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: 'Sorry, something went wrong. Please try again.',
                },
            ];
        } finally {
            loading = false;
            scrollToBottom();
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    }

    function clearChat() {
        messages = [];
    }
</script>

<!-- Chat Button -->
<button
    type="button"
    class="chat-bot-button fixed bottom-6 right-6 w-14 h-14 bg-main-green hover:bg-dark-green text-white rounded-full shadow-lg flex items-center justify-center transition-all z-50"
    on:click={toggleChat}
    aria-label={isOpen ? 'Close chat' : 'Open chat'}
>
    {#if isOpen}
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
    {:else}
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
        </svg>
    {/if}
</button>

<!-- Chat Window -->
{#if isOpen}
    <div
        class="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col max-h-[70vh]"
        transition:fly={{ y: 20, duration: 200 }}
    >
        <!-- Header -->
        <div class="bg-main-green text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
            <div class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                </svg>
                <span class="font-medium">AI Assistant</span>
            </div>
            {#if messages.length > 0}
                <button type="button" class="text-white/80 hover:text-white text-sm" on:click={clearChat}> Clear </button>
            {/if}
        </div>

        <!-- Messages -->
        <div bind:this={messagesContainer} class="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[400px]">
            {#if messages.length === 0}
                <div class="text-center text-gray-500 py-8">
                    <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                    </svg>
                    <p class="text-sm">How can I help you today?</p>
                </div>
            {:else}
                {#each messages as message (message.id)}
                    <div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}" transition:fade={{ duration: 150 }}>
                        <div
                            class="max-w-[80%] px-3 py-2 rounded-lg text-sm
								{message.role === 'user' ? 'bg-main-green text-white' : 'bg-gray-100 text-gray-800'}"
                        >
                            {message.content}
                        </div>
                    </div>
                {/each}
            {/if}

            {#if loading}
                <div class="flex justify-start">
                    <div class="bg-gray-100 px-4 py-2 rounded-lg">
                        <Spinner size="sm" />
                    </div>
                </div>
            {/if}
        </div>

        <!-- Input -->
        <div class="border-t border-gray-200 p-3">
            <div class="flex gap-2">
                <input
                    type="text"
                    bind:value={input}
                    placeholder="Ask me anything..."
                    maxlength={CHATBOT_CONFIG.MAX_CHARS}
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-main-green focus:border-transparent"
                    on:keydown={handleKeydown}
                    disabled={loading}
                />
                <Button variant="primary" size="sm" disabled={!canSend} on:click={sendMessage}>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </Button>
            </div>
            <p class="text-xs text-gray-400 mt-1 text-right">
                {input.length}/{CHATBOT_CONFIG.MAX_CHARS}
            </p>
        </div>
    </div>
{/if}
