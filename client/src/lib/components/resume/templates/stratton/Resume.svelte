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

<div class="stratton-resume p-8 font-serif text-[#222]">
	<!-- Header -->
	{#if shouldShowSection('Basics')}
		<header class="text-center mb-6 pb-4 border-b border-[#2c3e50]">
			<h1 class="text-2xl font-bold tracking-wide">{basics.name || 'Your Name'}</h1>

			<div class="flex flex-wrap justify-center gap-3 mt-2 text-xs">
				{#if basics.email}
					<span>{basics.email}</span>
				{/if}
				{#if basics.phone}
					<span>|</span>
					<span>{basics.phone}</span>
				{/if}
				{#if basics.location?.city}
					<span>|</span>
					<span>{basics.location.city}{basics.location.region ? `, ${basics.location.region}` : ''}</span>
				{/if}
				{#if basics.url}
					<span>|</span>
					<a href={basics.url} class="text-[#2c3e50] hover:underline">{basics.url}</a>
				{/if}
			</div>
		</header>
	{/if}

	<!-- Summary -->
	{#if shouldShowSection('Summary') && basics.summary}
		<section class="mb-4">
			<p class="text-xs leading-relaxed text-center italic">{basics.summary}</p>
		</section>
	{/if}

	<!-- Experience -->
	{#if shouldShowSection('Work') && resume.work && resume.work.length > 0}
		<section class="mb-4">
			<h2 class="text-sm font-bold uppercase tracking-wider border-b border-[#2c3e50] pb-1 mb-2">
				Professional Experience
			</h2>
			{#each resume.work as job}
				<div class="mb-3">
					<div class="flex justify-between items-baseline">
						<h3 class="font-bold text-xs">{job.position}</h3>
						<span class="text-xs">{formatDateRange(job.startDate, job.endDate, job.endDateCurrent)}</span>
					</div>
					<p class="text-xs italic">{job.name}</p>
					{#if job.highlights && job.highlights.length > 0}
						<ul class="list-disc list-inside mt-1 text-xs space-y-0.5 ml-2">
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
		<section class="mb-4">
			<h2 class="text-sm font-bold uppercase tracking-wider border-b border-[#2c3e50] pb-1 mb-2">
				Education
			</h2>
			{#each resume.education as edu}
				<div class="mb-2">
					<div class="flex justify-between items-baseline">
						<h3 class="font-bold text-xs">{edu.institution}</h3>
						<span class="text-xs">{formatDateRange(edu.startDate, edu.endDate, edu.endDateCurrent)}</span>
					</div>
					<p class="text-xs">{edu.studyType}{edu.area ? ` in ${edu.area}` : ''}</p>
				</div>
			{/each}
		</section>
	{/if}

	<!-- Skills -->
	{#if shouldShowSection('Skills') && resume.skills && resume.skills.length > 0}
		<section class="mb-4">
			<h2 class="text-sm font-bold uppercase tracking-wider border-b border-[#2c3e50] pb-1 mb-2">
				Skills
			</h2>
			<div class="text-xs">
				{#each resume.skills as skill, i}
					<span class="font-medium">{skill.name}</span>:
					{skill.keywords?.join(', ') || ''}
					{i < resume.skills.length - 1 ? ' | ' : ''}
				{/each}
			</div>
		</section>
	{/if}

	<!-- Projects -->
	{#if shouldShowSection('Projects') && resume.projects && resume.projects.length > 0}
		<section class="mb-4">
			<h2 class="text-sm font-bold uppercase tracking-wider border-b border-[#2c3e50] pb-1 mb-2">
				Projects
			</h2>
			{#each resume.projects as project}
				<div class="mb-2">
					<h3 class="font-bold text-xs">{project.name}</h3>
					{#if project.highlights && project.highlights.length > 0}
						<ul class="list-disc list-inside text-xs space-y-0.5 ml-2">
							{#each project.highlights as highlight}
								{#if highlight}<li>{highlight}</li>{/if}
							{/each}
						</ul>
					{/if}
				</div>
			{/each}
		</section>
	{/if}
</div>

<style>
	.stratton-resume {
		font-family: 'Georgia', 'Times New Roman', Times, serif;
		font-size: 10pt;
		line-height: 1.2;
	}
</style>
