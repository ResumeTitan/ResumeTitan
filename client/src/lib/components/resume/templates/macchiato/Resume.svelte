<script lang="ts">
	import type { ResumeType } from '$types';
	import { formatDateRange } from '$utils';

	export let resume: ResumeType;

	$: basics = resume.basics;
	$: sections = resume.sections || [];

	function shouldShowSection(sectionName: string): boolean {
		return sections.includes(sectionName);
	}
</script>

<div class="macchiato-resume flex">
	<!-- Left Sidebar -->
	<aside class="w-1/3 bg-gray-50 p-6 border-r-4 border-[#56817A]">
		<!-- Contact Info -->
		{#if shouldShowSection('Basics')}
			<div class="mb-8">
				<h1 class="text-2xl font-bold text-[#56817A] mb-4">{basics.name || 'Your Name'}</h1>
				{#if basics.label}
					<p class="text-gray-700 mb-4">{basics.label}</p>
				{/if}

				<div class="space-y-2 text-sm">
					{#if basics.email}
						<p>{basics.email}</p>
					{/if}
					{#if basics.phone}
						<p>{basics.phone}</p>
					{/if}
					{#if basics.location?.city}
						<p>{basics.location.city}{basics.location.region ? `, ${basics.location.region}` : ''}</p>
					{/if}
					{#if basics.url}
						<a href={basics.url} class="text-[#56817A] hover:underline block">{basics.url}</a>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Skills -->
		{#if shouldShowSection('Skills') && resume.skills && resume.skills.length > 0}
			<div class="mb-8">
				<h2 class="text-lg font-bold text-[#56817A] border-b-2 border-[#56817A] pb-1 mb-3">Skills</h2>
				{#each resume.skills as skill}
					<div class="mb-3">
						<p class="font-medium text-sm">{skill.name}</p>
						{#if skill.keywords && skill.keywords.length > 0}
							<p class="text-xs text-gray-600">{skill.keywords.join(', ')}</p>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<!-- Languages -->
		{#if shouldShowSection('Languages') && resume.languages && resume.languages.length > 0}
			<div class="mb-8">
				<h2 class="text-lg font-bold text-[#56817A] border-b-2 border-[#56817A] pb-1 mb-3">Languages</h2>
				{#each resume.languages as lang}
					<p class="text-sm mb-1">{lang.language} - {lang.fluency}</p>
				{/each}
			</div>
		{/if}

		<!-- Awards -->
		{#if shouldShowSection('Awards') && resume.awards && resume.awards.length > 0}
			<div class="mb-8">
				<h2 class="text-lg font-bold text-[#56817A] border-b-2 border-[#56817A] pb-1 mb-3">Awards</h2>
				{#each resume.awards as award}
					<div class="mb-2">
						<p class="font-medium text-sm">{award.title}</p>
						<p class="text-xs text-gray-600">{award.awarder}</p>
					</div>
				{/each}
			</div>
		{/if}
	</aside>

	<!-- Main Content -->
	<main class="w-2/3 p-6">
		<!-- Summary -->
		{#if shouldShowSection('Summary') && basics.summary}
			<section class="mb-6">
				<h2 class="text-lg font-bold text-[#56817A] border-b-2 border-[#56817A] pb-1 mb-3">Profile</h2>
				<p class="text-sm leading-relaxed">{basics.summary}</p>
			</section>
		{/if}

		<!-- Experience -->
		{#if shouldShowSection('Work') && resume.work && resume.work.length > 0}
			<section class="mb-6">
				<h2 class="text-lg font-bold text-[#56817A] border-b-2 border-[#56817A] pb-1 mb-3">Experience</h2>
				{#each resume.work as job}
					<div class="mb-4">
						<div class="flex justify-between items-start">
							<div>
								<h3 class="font-bold">{job.position}</h3>
								<p class="text-gray-700 text-sm">{job.name}</p>
							</div>
							<span class="text-xs text-gray-600">
								{formatDateRange(job.startDate, job.endDate, job.endDateCurrent)}
							</span>
						</div>
						{#if job.highlights && job.highlights.length > 0}
							<ul class="list-disc list-inside mt-2 text-sm space-y-1">
								{#each job.highlights as highlight}
									{#if highlight}<li>{highlight}</li>{/if}
								{/each}
							</ul>
						{/if}
					</div>
				{/each}
			</section>
		{/if}

		<!-- Education -->
		{#if shouldShowSection('Education') && resume.education && resume.education.length > 0}
			<section class="mb-6">
				<h2 class="text-lg font-bold text-[#56817A] border-b-2 border-[#56817A] pb-1 mb-3">Education</h2>
				{#each resume.education as edu}
					<div class="mb-4">
						<div class="flex justify-between items-start">
							<div>
								<h3 class="font-bold">{edu.institution}</h3>
								<p class="text-gray-700 text-sm">{edu.studyType} in {edu.area}</p>
							</div>
							<span class="text-xs text-gray-600">
								{formatDateRange(edu.startDate, edu.endDate, edu.endDateCurrent)}
							</span>
						</div>
					</div>
				{/each}
			</section>
		{/if}

		<!-- Projects -->
		{#if shouldShowSection('Projects') && resume.projects && resume.projects.length > 0}
			<section class="mb-6">
				<h2 class="text-lg font-bold text-[#56817A] border-b-2 border-[#56817A] pb-1 mb-3">Projects</h2>
				{#each resume.projects as project}
					<div class="mb-4">
						<h3 class="font-bold">{project.name}</h3>
						{#if project.highlights && project.highlights.length > 0}
							<ul class="list-disc list-inside mt-2 text-sm space-y-1">
								{#each project.highlights as highlight}
									{#if highlight}<li>{highlight}</li>{/if}
								{/each}
							</ul>
						{/if}
					</div>
				{/each}
			</section>
		{/if}
	</main>
</div>

<style>
	.macchiato-resume {
		min-height: 297mm;
	}
</style>
