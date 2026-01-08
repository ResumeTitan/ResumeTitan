<script lang="ts">
    import { page } from '$app/stores';
    import Button from '$components/ui/Button.svelte';

    $: docName = $page.params.docName || '';

    const docContent: Record<string, { title: string; content: string[] }> = {
        'getting-started': {
            title: 'Getting Started',
            content: [
                'Welcome to ResumeTitan! This guide will help you create your first professional resume.',
                'Step 1: Create an account or sign in to get started.',
                'Step 2: Click "New Resume" from your dashboard.',
                'Step 3: Fill in your personal information, work experience, and education.',
                'Step 4: Use AI to enhance your bullet points and summary.',
                'Step 5: Choose a template and customize the appearance.',
                'Step 6: Preview and export your resume as PDF.',
            ],
        },
        templates: {
            title: 'Resume Templates',
            content: [
                'ResumeTitan offers 6 professional templates designed for different needs:',
                '• Professional - Clean, classic design suitable for most industries',
                '• Harvard - Traditional academic-style formatting',
                '• Macchiato - Modern two-column layout with sidebar',
                '• Stratton - Elegant serif-based formal design',
                '• One Page - Compact layout for concise resumes',
                '• Student Classic - Perfect for recent graduates',
                '• Academic Modern - Contemporary design with visual flair',
            ],
        },
        'ai-features': {
            title: 'AI Features',
            content: [
                'Our AI helps you create compelling resume content:',
                '• Bullet Point Enhancement - Transform basic descriptions into impactful achievements',
                '• Summary Generation - Create professional summaries tailored to your experience',
                '• Skills Suggestions - Get recommendations based on your background',
                '• Brainstorming - Generate ideas for what to include in each section',
                'All AI features are designed to enhance your voice, not replace it.',
            ],
        },
        'cover-letters': {
            title: 'Cover Letters',
            content: [
                'Create tailored cover letters in minutes:',
                '• Paste a job description to generate a customized letter',
                '• Select which resume to use as context',
                '• Edit and personalize the generated content',
                '• Export as PDF or copy to clipboard',
                'Cover letters are automatically formatted for professional presentation.',
            ],
        },
        'interview-prep': {
            title: 'Interview Preparation',
            content: [
                'Prepare for interviews with AI assistance:',
                '• Generate common interview questions for your target role',
                '• Practice answering with voice-to-text input',
                '• Get AI analysis of your answers with improvement suggestions',
                '• Track your progress and revisit past practice sessions',
                'Be interview-ready with personalized preparation.',
            ],
        },
        tips: {
            title: 'Resume Tips',
            content: [
                'Best practices for effective resumes:',
                '• Use action verbs to start bullet points (Led, Developed, Achieved)',
                '• Quantify achievements when possible (Increased sales by 25%)',
                '• Keep it concise - one page for most roles, two for senior positions',
                '• Tailor your resume for each application',
                '• Use standard section headings for ATS compatibility',
                '• Proofread carefully - typos can be deal-breakers',
                '• Include relevant keywords from the job description',
            ],
        },
    };

    $: doc = docContent[docName] || { title: 'Not Found', content: ['Document not found.'] };
</script>

<svelte:head>
    <title>{doc.title} - ResumeTitan Docs</title>
</svelte:head>

<div class="page-container">
    <div class="max-w-4xl mx-auto px-4 py-12">
        <a href="/docs" class="text-main-green hover:underline mb-4 inline-block"> ← Back to Documentation </a>

        <h1 class="text-4xl font-bold mb-8">{doc.title}</h1>

        <div class="prose prose-lg max-w-none">
            {#each doc.content as paragraph}
                <p class="mb-4 text-gray-700">{paragraph}</p>
            {/each}
        </div>

        <div class="mt-12 pt-8 border-t border-gray-200">
            <p class="text-gray-600 mb-4">Ready to get started?</p>
            <a href="/dashboard">
                <Button variant="primary">Go to Dashboard</Button>
            </a>
        </div>
    </div>
</div>
