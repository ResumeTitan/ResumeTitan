<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import Button from '$components/ui/Button.svelte';
    import Spinner from '$components/ui/Spinner.svelte';
    import Alert from '$components/ui/Alert.svelte';
    import Modal from '$components/ui/Modal.svelte';
    import FormField from '$components/forms/FormField.svelte';
    import FormArea from '$components/forms/FormArea.svelte';
    import { authStore } from '$stores/auth';
    import { api } from '$lib/api/client';

    interface InterviewQuestion {
        question: string;
        example: string;
        guidance: string;
        answer: string;
    }

    interface InterviewData {
        _id: string;
        questions: InterviewQuestion[];
        jobTitle?: string;
        jobDescription?: string;
        company?: string;
        jobUrl?: string;
    }

    let jobTitle = '';
    let jobDescription = '';
    let jobUrl = '';
    let company = '';
    let inputMode: 'manual' | 'link' = 'manual';
    let interview: InterviewQuestion[] = [];
    let isLoading = false;
    let interviewId: string | null = null;
    let showSaveMessage = false;
    let analysis: string[] = [];
    let analyzingIndex: number | null = null;
    let showConfirmPopup = false;
    let errorMessage = '';
    let expandedDetails: Record<number, { example: boolean; guidance: boolean }> = {};

    onMount(async () => {
        const user = $authStore.user;
        if (!user) {
            authStore.openAuthModal();
            return;
        }

        // Check for existing interview ID in URL
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (id) {
            interviewId = id;
            await loadInterview(id);
        }
    });

    async function loadInterview(id: string) {
        isLoading = true;
        try {
            const response = await api.get<{ interview: InterviewData }>(`/interview/${id}`);
            const data = response.interview;
            interview = data.questions || [];
            jobTitle = data.jobTitle || '';
            jobDescription = data.jobDescription || '';
            company = data.company || '';
            if (data.jobUrl) {
                inputMode = 'link';
                jobUrl = data.jobUrl;
            } else {
                inputMode = 'manual';
                jobUrl = '';
            }
        } catch (err) {
            console.error(err);
        } finally {
            isLoading = false;
        }
    }

    async function handleGenerateInterview() {
        const user = $authStore.user;
        if (!user) {
            errorMessage = 'User not found';
            return;
        }

        try {
            isLoading = true;
            errorMessage = '';

            let payload: Record<string, unknown> = {
                interviewId: interviewId || '',
                clerkId: user.id,
                useJobUrl: inputMode === 'link',
            };

            if (inputMode === 'link') {
                payload.jobUrl = jobUrl;
            } else {
                payload.jobTitle = jobTitle;
                payload.jobDescription = jobDescription;
                payload.company = company;
            }

            const response = await api.post<{ interview: InterviewData }>('/interview', payload);
            interview = response.interview.questions || [];

            if (response.interview.jobTitle) {
                jobTitle = response.interview.jobTitle;
            }
            if (response.interview.jobDescription) {
                jobDescription = response.interview.jobDescription;
            }
            if (response.interview.company) {
                company = response.interview.company;
            }

            interviewId = response.interview._id;
        } catch (error: unknown) {
            console.error(error);
            const err = error as { response?: { status?: number; data?: { errorType?: string } } };
            if (inputMode === 'link' && (err.response?.status === 400 || err.response?.data?.errorType === 'URL_PARSE_ERROR')) {
                errorMessage = 'Failed to load job, please enter manually or try again later';
                inputMode = 'manual';
            } else {
                errorMessage = 'An error occurred while generating interview questions';
            }
        } finally {
            isLoading = false;
        }
    }

    async function handleSaveInterview() {
        if (!interviewId) return;

        isLoading = true;
        try {
            const response = await api.put<{ interview: InterviewData }>(`/interview/${interviewId}`, {
                jobTitle,
                jobDescription,
                company,
                jobUrl,
                useJobUrl: inputMode === 'link',
                questions: interview,
            });
            interview = response.interview.questions;
            showSaveMessage = true;
            setTimeout(() => (showSaveMessage = false), 2000);
        } catch (error) {
            console.error(error);
            errorMessage = 'Failed to save interview';
        } finally {
            isLoading = false;
        }
    }

    function handleAnswerChange(index: number, value: string) {
        interview[index].answer = value;
        interview = [...interview];
    }

    async function handleAnalyzeAnswer(index: number) {
        analyzingIndex = index;
        try {
            const question = interview[index];
            const response = await api.post<{ analysis: string }>('/interview/analyze', {
                question: question.question,
                answer: question.answer,
            });
            analysis[index] = response.analysis;
            analysis = [...analysis];
        } catch (error) {
            analysis[index] = 'Error analyzing answer.';
            analysis = [...analysis];
        } finally {
            analyzingIndex = null;
        }
    }

    function onGenerateClick() {
        if (interview.length > 0) {
            showConfirmPopup = true;
        } else {
            handleGenerateInterview();
        }
    }

    function handlePrintInterview() {
        document.body.classList.add('printing-interview');
        window.print();
        setTimeout(() => {
            document.body.classList.remove('printing-interview');
        }, 1000);
    }

    function toggleDetails(index: number, type: 'example' | 'guidance') {
        if (!expandedDetails[index]) {
            expandedDetails[index] = { example: false, guidance: false };
        }
        expandedDetails[index][type] = !expandedDetails[index][type];
        expandedDetails = { ...expandedDetails };
    }
</script>

<svelte:head>
    <title>Interview Prep - ResumeTitan</title>
</svelte:head>

<div class="page-container">
    <div class="page-header">
        <!-- Form Section -->
        <div class="form-container">
            <div class="form-text-main">Enter Details</div>
            <div class="p-4">
                <!-- Tab buttons -->
                <div class="flex mb-4 gap-0.5">
                    <button
                        type="button"
                        class="flex-1 py-1.5 rounded-t-lg font-bold text-lg transition-colors {inputMode === 'manual'
                            ? 'bg-main-green text-white'
                            : 'bg-gray-200 text-main-green'}"
                        on:click={() => (inputMode = 'manual')}
                    >
                        Job Title/Description
                    </button>
                    <button
                        type="button"
                        class="flex-1 py-1.5 rounded-t-lg font-bold text-lg transition-colors {inputMode === 'link'
                            ? 'bg-main-green text-white'
                            : 'bg-gray-200 text-main-green'}"
                        on:click={() => (inputMode = 'link')}
                    >
                        Job URL
                    </button>
                </div>

                <!-- Error Message -->
                {#if errorMessage}
                    <Alert variant="error" dismissible onDismiss={() => (errorMessage = '')}>
                        {errorMessage}
                    </Alert>
                {/if}

                {#if inputMode === 'link'}
                    <div class="w-full pr-2">
                        <label for="jobUrl" class="form-label-text">Job Posting URL</label>
                        <input
                            type="text"
                            id="jobUrl"
                            class="form-style"
                            bind:value={jobUrl}
                            placeholder="Paste the job posting link here..."
                        />
                    </div>
                {:else}
                    <div class="w-full pr-2">
                        <label for="company" class="form-label-text">Company</label>
                        <input type="text" id="company" class="form-style" bind:value={company} />
                    </div>
                    <div class="w-full pr-2 mt-4">
                        <label for="title" class="form-label-text">Job Title</label>
                        <input type="text" id="title" class="form-style" bind:value={jobTitle} />
                    </div>
                    <div class="mt-4">
                        <label for="description" class="form-label-text">Job Description</label>
                        <textarea id="description" class="form-style" rows="10" bind:value={jobDescription}></textarea>
                    </div>
                {/if}
            </div>
            <div class="left-right-spacing p-2 flex gap-4">
                <Button variant="primary" on:click={onGenerateClick}>Generate Interview Questions</Button>
                <Button variant="secondary" on:click={handleSaveInterview} disabled={isLoading || interview.length === 0}>
                    Save Interview
                </Button>
            </div>
        </div>

        <!-- Interview Questions -->
        {#if interview.length > 0}
            <div class="form-container mt-8">
                <div class="form-text-main flex justify-between items-center mb-4">
                    <span>Interview Questions</span>
                    <Button variant="secondary" on:click={handlePrintInterview}>
                        <svg class="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fill-rule="evenodd"
                                d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        Print Interview
                    </Button>
                </div>

                <div class="interview-questions space-y-6">
                    {#each interview as question, index}
                        <div class="question-container p-6 border-2 border-gray-300 rounded-lg bg-white shadow-sm">
                            <div class="p-4 font-bold text-lg md:text-xl text-black border-b border-gray-200 mb-2">
                                {index + 1}. {question.question}
                            </div>
                            <div class="px-4">
                                <textarea
                                    class="form-style text-base md:text-lg text-black h-40"
                                    bind:value={question.answer}
                                    on:input={e => handleAnswerChange(index, e.currentTarget.value)}
                                    placeholder="Type your answer here..."
                                ></textarea>
                            </div>

                            <!-- Example Answer -->
                            <div class="px-4 mt-2">
                                <button
                                    type="button"
                                    class="text-base md:text-lg font-semibold text-black flex items-center"
                                    on:click={() => toggleDetails(index, 'example')}
                                >
                                    <svg
                                        class="w-4 h-4 mr-2 transform transition-transform {expandedDetails[index]?.example
                                            ? 'rotate-90'
                                            : ''}"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                    Example Answer:
                                </button>
                                {#if expandedDetails[index]?.example}
                                    <p class="text-base md:text-lg text-black mt-2 pl-6">{question.example}</p>
                                {/if}
                            </div>

                            <!-- Guidance -->
                            <div class="px-4 mt-2">
                                <button
                                    type="button"
                                    class="text-base md:text-lg font-semibold text-black flex items-center"
                                    on:click={() => toggleDetails(index, 'guidance')}
                                >
                                    <svg
                                        class="w-4 h-4 mr-2 transform transition-transform {expandedDetails[index]?.guidance
                                            ? 'rotate-90'
                                            : ''}"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                    Guidance:
                                </button>
                                {#if expandedDetails[index]?.guidance}
                                    <p class="text-base md:text-lg text-black mt-2 pl-6">{question.guidance}</p>
                                {/if}
                            </div>

                            <div class="px-4 pb-2 mt-4">
                                <Button
                                    variant="primary"
                                    on:click={() => handleAnalyzeAnswer(index)}
                                    disabled={analyzingIndex === index || !question.answer}
                                >
                                    {analyzingIndex === index ? 'Analyzing...' : 'Analyze My Answer'}
                                </Button>
                                {#if analysis[index]}
                                    <div class="mt-2 p-2 border rounded bg-gray-50 text-black">
                                        <strong>AI Analysis:</strong>
                                        {analysis[index]}
                                    </div>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Footer Actions -->
        <div class="py-4 flex justify-between">
            <Button variant="secondary" on:click={() => goto('/dashboard')}>Exit to Dashboard</Button>
            {#if interview.length > 0}
                <Button variant="primary" on:click={handleSaveInterview}>Save Interview</Button>
            {/if}
        </div>

        {#if showSaveMessage}
            <div
                class="fixed top-8 left-1/2 transform -translate-x-1/2 bg-white text-dark-green px-6 py-3 rounded text-base whitespace-nowrap animate-fade-in-out border border-dark-green z-50 shadow-lg font-semibold"
            >
                Interview Saved!
            </div>
        {/if}
    </div>

    <!-- Confirm Popup -->
    {#if showConfirmPopup}
        <Modal title="Are you sure?" onClose={() => (showConfirmPopup = false)}>
            <p class="text-black mb-4 text-sm">Generating new questions will overwrite your current questions and answers.</p>
            <div class="flex justify-end gap-2">
                <Button variant="secondary" on:click={() => (showConfirmPopup = false)}>Cancel</Button>
                <Button
                    variant="primary"
                    on:click={() => {
                        showConfirmPopup = false;
                        handleGenerateInterview();
                    }}
                >
                    Yes, Overwrite
                </Button>
            </div>
        </Modal>
    {/if}

    {#if isLoading}
        <Spinner />
    {/if}
</div>
