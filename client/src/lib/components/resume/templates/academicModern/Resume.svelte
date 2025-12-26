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

<div class="academic-modern-resume">
	<!-- Header with gradient -->
	{#if shouldShowSection('Basics')}
		<header class="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-8">
			<h1 class="text-3xl font-bold">{basics.name || 'Your Name'}</h1>
			{#if basics.label}
				<p class="text-lg opacity-90 mt-1">{basics.label}</p>
			{/if}

			<div class="flex flex-wrap gap-4 mt-4 text-sm opacity-90">
				{#if basics.email}
					<span class="flex items-center gap-1">
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
							<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
							<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
						</svg>
						{basics.email}
					</span>
				{/if}
				{#if basics.phone}
					<span class="flex items-center gap-1">
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
							<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
						</svg>
						{basics.phone}
					</span>
				{/if}
				{#if basics.location?.city}
					<span class="flex items-center gap-1">
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
						</svg>
						{basics.location.city}{basics.location.region ? `, ${basics.location.region}` : ''}
					</span>
				{/if}
			</div>
		</header>
	{/if}

	<div class="p-8">
		<!-- Summary -->
		{#if shouldShowSection('Summary') && basics.summary}
			<section class="mb-6 bg-[#f8faff] p-4 rounded-lg border border-[#e1e8ff]">
				<p class="text-sm leading-relaxed text-[#333]">{basics.summary}</p>
			</section>
		{/if}

		<!-- Education -->
		{#if shouldShowSection('Education') && resume.education && resume.education.length > 0}
			<section class="mb-6">
				<h2 class="text-lg font-bold text-[#667eea] mb-4 flex items-center gap-2">
					<span class="w-8 h-1 bg-[#667eea] rounded"></span>
					Education
				</h2>
				{#each resume.education as edu}
					<div class="mb-4 bg-[#fafbff] p-4 rounded-lg border border-[#e1e8ff]">
						<div class="flex justify-between items-start">
							<div>
								<h3 class="font-bold text-[#333]">{edu.institution}</h3>
								<p class="text-[#555]">{edu.studyType}{edu.area ? ` in ${edu.area}` : ''}</p>
							</div>
							<span class="text-sm text-[#667eea] font-medium">
								{formatDateRange(edu.startDate, edu.endDate, edu.endDateCurrent)}
							</span>
						</div>
						{#if edu.highlights && edu.highlights.length > 0}
							<ul class="mt-2 text-sm text-[#555] space-y-1">
								{#each edu.highlights as highlight}
									{#if highlight}<li>• {highlight}</li>{/if}
								{/each}
							</ul>
						{/if}
					</div>
				{/each}
			</section>
		{/if}

		<!-- Experience -->
		{#if shouldShowSection('Work') && resume.work && resume.work.length > 0}
			<section class="mb-6">
				<h2 class="text-lg font-bold text-[#667eea] mb-4 flex items-center gap-2">
					<span class="w-8 h-1 bg-[#667eea] rounded"></span>
					Experience
				</h2>
				{#each resume.work as job}
					<div class="mb-4 border-l-4 border-[#667eea] pl-4">
						<div class="flex justify-between items-start">
							<div>
								<h3 class="font-bold text-[#333]">{job.position}</h3>
								<p class="text-[#667eea]">{job.name}</p>
							</div>
							<span class="text-sm text-[#555]">
								{formatDateRange(job.startDate, job.endDate, job.endDateCurrent)}
							</span>
						</div>
						{#if job.highlights && job.highlights.length > 0}
							<ul class="mt-2 text-sm text-[#555] space-y-1">
								{#each job.highlights as highlight}
									{#if highlight}<li>• {highlight}</li>{/if}
								{/each}
							</ul>
						{/if}
					</div>
				{/each}
			</section>
		{/if}

		<!-- Skills as tags -->
		{#if shouldShowSection('Skills') && resume.skills && resume.skills.length > 0}
			<section class="mb-6">
				<h2 class="text-lg font-bold text-[#667eea] mb-4 flex items-center gap-2">
					<span class="w-8 h-1 bg-[#667eea] rounded"></span>
					Skills
				</h2>
				<div class="flex flex-wrap gap-2">
					{#each resume.skills as skill}
						{#if skill.keywords}
							{#each skill.keywords as keyword}
								<span class="bg-[#667eea] text-white px-3 py-1 rounded-full text-sm">
									{keyword}
								</span>
							{/each}
						{/if}
					{/each}
				</div>
			</section>
		{/if}

		<!-- Projects as cards -->
		{#if shouldShowSection('Projects') && resume.projects && resume.projects.length > 0}
			<section class="mb-6">
				<h2 class="text-lg font-bold text-[#667eea] mb-4 flex items-center gap-2">
					<span class="w-8 h-1 bg-[#667eea] rounded"></span>
					Projects
				</h2>
				<div class="grid gap-4">
					{#each resume.projects as project}
						<div class="bg-[#f8faff] p-4 rounded-lg border border-[#e1e8ff]">
							<h3 class="font-bold text-[#333]">
								{project.name}
								{#if project.url}
									<a href={project.url} class="text-[#667eea] text-sm font-normal ml-2">↗</a>
								{/if}
							</h3>
							{#if project.highlights && project.highlights.length > 0}
								<ul class="mt-2 text-sm text-[#555] space-y-1">
									{#each project.highlights as highlight}
										{#if highlight}<li>• {highlight}</li>{/if}
									{/each}
								</ul>
							{/if}
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Awards/Certificates with accent border -->
		{#if shouldShowSection('Awards') && resume.awards && resume.awards.length > 0}
			<section class="mb-6">
				<h2 class="text-lg font-bold text-[#667eea] mb-4 flex items-center gap-2">
					<span class="w-8 h-1 bg-[#667eea] rounded"></span>
					Awards & Honors
				</h2>
				{#each resume.awards as award}
					<div class="border-l-4 border-[#764ba2] pl-4 mb-3">
						<p class="font-medium text-[#333]">{award.title}</p>
						<p class="text-sm text-[#555]">{award.awarder} • {award.date}</p>
					</div>
				{/each}
			</section>
		{/if}
	</div>
</div>
