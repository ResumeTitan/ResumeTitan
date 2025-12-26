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

<div class="student-classic-resume">
	<!-- Header with beige background -->
	{#if shouldShowSection('Basics')}
		<header class="bg-[#ece8dd] p-6 text-center">
			<h1 class="text-2xl font-bold">{basics.name || 'Your Name'}</h1>
			{#if basics.label}
				<p class="text-gray-600 mt-1">{basics.label}</p>
			{/if}

			<div class="flex flex-wrap justify-center gap-3 mt-3 text-sm text-[#555]">
				{#if basics.email}<span>{basics.email}</span>{/if}
				{#if basics.phone}<span>|</span><span>{basics.phone}</span>{/if}
				{#if basics.location?.city}
					<span>|</span>
					<span>{basics.location.city}{basics.location.region ? `, ${basics.location.region}` : ''}</span>
				{/if}
			</div>
		</header>
	{/if}

	<div class="p-6">
		<!-- Summary -->
		{#if shouldShowSection('Summary') && basics.summary}
			<section class="mb-5">
				<h2 class="text-base font-bold border-b-2 border-[#bdb76b] pb-1 mb-3">OBJECTIVE</h2>
				<p class="text-sm">{basics.summary}</p>
			</section>
		{/if}

		<!-- Education (prioritized for students) -->
		{#if shouldShowSection('Education') && resume.education && resume.education.length > 0}
			<section class="mb-5">
				<h2 class="text-base font-bold border-b-2 border-[#bdb76b] pb-1 mb-3">EDUCATION</h2>
				{#each resume.education as edu}
					<div class="mb-3">
						<div class="flex justify-between">
							<h3 class="font-bold text-sm">{edu.institution}</h3>
							<span class="text-sm text-[#555]">
								{formatDateRange(edu.startDate, edu.endDate, edu.endDateCurrent)}
							</span>
						</div>
						<p class="text-sm">{edu.studyType}{edu.area ? ` in ${edu.area}` : ''}</p>
						{#if edu.score}
							<p class="text-sm text-[#555]">GPA: {edu.score}</p>
						{/if}
						{#if edu.highlights && edu.highlights.length > 0}
							<ul class="list-disc list-inside text-sm mt-1">
								{#each edu.highlights as highlight}
									{#if highlight}<li>{highlight}</li>{/if}
								{/each}
							</ul>
						{/if}
					</div>
				{/each}
			</section>
		{/if}

		<!-- Experience -->
		{#if shouldShowSection('Work') && resume.work && resume.work.length > 0}
			<section class="mb-5">
				<h2 class="text-base font-bold border-b-2 border-[#bdb76b] pb-1 mb-3">EXPERIENCE</h2>
				{#each resume.work as job}
					<div class="mb-3">
						<div class="flex justify-between">
							<h3 class="font-bold text-sm">{job.position}</h3>
							<span class="text-sm text-[#555]">
								{formatDateRange(job.startDate, job.endDate, job.endDateCurrent)}
							</span>
						</div>
						<p class="text-sm italic">{job.name}</p>
						{#if job.highlights && job.highlights.length > 0}
							<ul class="list-disc list-inside text-sm mt-1">
								{#each job.highlights as highlight}
									{#if highlight}<li>{highlight}</li>{/if}
								{/each}
							</ul>
						{/if}
					</div>
				{/each}
			</section>
		{/if}

		<!-- Skills -->
		{#if shouldShowSection('Skills') && resume.skills && resume.skills.length > 0}
			<section class="mb-5">
				<h2 class="text-base font-bold border-b-2 border-[#bdb76b] pb-1 mb-3">SKILLS</h2>
				<div class="text-sm">
					{#each resume.skills as skill}
						<p class="mb-1">
							<span class="font-medium">{skill.name}:</span>
							{skill.keywords?.join(', ')}
						</p>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Activities / Volunteer -->
		{#if shouldShowSection('Volunteer') && resume.volunteer && resume.volunteer.length > 0}
			<section class="mb-5">
				<h2 class="text-base font-bold border-b-2 border-[#bdb76b] pb-1 mb-3">ACTIVITIES</h2>
				{#each resume.volunteer as vol}
					<div class="mb-2">
						<div class="flex justify-between">
							<span class="font-medium text-sm">{vol.position} - {vol.organization}</span>
							<span class="text-sm text-[#555]">
								{formatDateRange(vol.startDate, vol.endDate, vol.endDateCurrent)}
							</span>
						</div>
					</div>
				{/each}
			</section>
		{/if}

		<!-- Awards -->
		{#if shouldShowSection('Awards') && resume.awards && resume.awards.length > 0}
			<section class="mb-5">
				<h2 class="text-base font-bold border-b-2 border-[#bdb76b] pb-1 mb-3">HONORS & AWARDS</h2>
				{#each resume.awards as award}
					<p class="text-sm mb-1">{award.title} - {award.awarder} ({award.date})</p>
				{/each}
			</section>
		{/if}
	</div>
</div>
