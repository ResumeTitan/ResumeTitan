<script lang="ts">
	const docs = [
		{
			id: 'getting-started',
			title: 'Getting Started',
			description: 'Learn how to create your first resume with ResumeTitan.'
		},
		{
			id: 'templates',
			title: 'Resume Templates',
			description: 'Explore our professional resume templates and choose the right one for you.'
		},
		{
			id: 'ai-features',
			title: 'AI Features',
			description: 'How to use AI to enhance your resume content and interview prep.'
		},
		{
			id: 'cover-letters',
			title: 'Cover Letters',
			description: 'Create compelling cover letters tailored to specific job postings.'
		},
		{
			id: 'interview-prep',
			title: 'Interview Preparation',
			description: 'Practice with AI-generated interview questions and get feedback.'
		},
		{
			id: 'tips',
			title: 'Resume Tips',
			description: 'Best practices for creating an effective, ATS-friendly resume.'
		}
	];
</script>

<svelte:head>
	<title>Documentation - ResumeTitan</title>
</svelte:head>

<div class="page-container">
	<div class="max-w-4xl mx-auto px-4 py-12">
		<h1 class="text-4xl font-bold mb-4">User Guides</h1>
		<p class="text-gray-600 mb-8">
			Everything you need to know to create winning resumes and prepare for interviews.
		</p>

		<div class="grid md:grid-cols-2 gap-6">
			{#each docs as doc (doc.id)}
				<a
					href="/docs/{doc.id}"
					class="block p-6 border-2 border-gray-200 rounded-lg hover:border-main-green hover:shadow-md transition-all"
				>
					<h2 class="text-xl font-semibold mb-2">{doc.title}</h2>
					<p class="text-gray-600">{doc.description}</p>
				</a>
			{/each}
		</div>
	</div>
</div>
