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

<div class="onepage-resume p-6 max-w-[660px] mx-auto">
	<!-- Header -->
	{#if shouldShowSection('Basics')}
		<header class="mb-4">
			<h1 class="text-xl font-bold">{basics.name || 'Your Name'}</h1>
			<div class="flex flex-wrap gap-2 text-xs text-gray-600 mt-1">
				{#if basics.email}<span>{basics.email}</span>{/if}
				{#if basics.phone}<span>• {basics.phone}</span>{/if}
				{#if basics.location?.city}
					<span>• {basics.location.city}{basics.location.region ? `, ${basics.location.region}` : ''}</span>
				{/if}
			</div>
		</header>
	{/if}

	<!-- Summary -->
	{#if shouldShowSection('Summary') && basics.summary}
		<section class="mb-3 pb-3 border-b border-dashed border-[#cfcfcf]">
			<p class="text-xs">{basics.summary}</p>
		</section>
	{/if}

	<!-- Experience -->
	{#if shouldShowSection('Work') && resume.work && resume.work.length > 0}
		<section class="mb-3 pb-3 border-b border-dashed border-[#cfcfcf]">
			<h2 class="text-sm font-bold mb-2">Experience</h2>
			{#each resume.work as job}
				<div class="mb-2">
					<div class="flex justify-between text-xs">
						<span class="font-medium">{job.position} at {job.name}</span>
						<span class="text-gray-500">{formatDateRange(job.startDate, job.endDate, job.endDateCurrent)}</span>
					</div>
					{#if job.highlights && job.highlights.length > 0}
						<ul class="list-disc list-inside text-xs mt-1 text-gray-700">
							{#each job.highlights.slice(0, 3) as highlight}
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
		<section class="mb-3 pb-3 border-b border-dashed border-[#cfcfcf]">
			<h2 class="text-sm font-bold mb-2">Education</h2>
			{#each resume.education as edu}
				<div class="flex justify-between text-xs mb-1">
					<span>
						<span class="font-medium">{edu.institution}</span> -
						{edu.studyType}{edu.area ? ` in ${edu.area}` : ''}
					</span>
					<span class="text-gray-500">{formatDateRange(edu.startDate, edu.endDate, edu.endDateCurrent)}</span>
				</div>
			{/each}
		</section>
	{/if}

	<!-- Skills -->
	{#if shouldShowSection('Skills') && resume.skills && resume.skills.length > 0}
		<section class="mb-3">
			<h2 class="text-sm font-bold mb-2">Skills</h2>
			<div class="text-xs">
				{#each resume.skills as skill}
					<span class="inline-block mr-3 mb-1">
						<span class="font-medium">{skill.name}:</span> {skill.keywords?.join(', ')}
					</span>
				{/each}
			</div>
		</section>
	{/if}
</div>

<style>
	.onepage-resume {
		font-size: 11px;
		line-height: 1.4;
	}
</style>
