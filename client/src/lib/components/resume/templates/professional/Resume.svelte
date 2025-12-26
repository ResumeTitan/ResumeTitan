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

<div class="professional-resume p-8">
	<!-- Header / Basics -->
	{#if shouldShowSection('Basics')}
		<header class="text-center mb-6 border-b-2 border-black pb-4">
			<h1 class="text-3xl font-bold uppercase tracking-wide">{basics.name || 'Your Name'}</h1>
			{#if basics.label}
				<p class="text-lg text-gray-700 mt-1">{basics.label}</p>
			{/if}

			<div class="flex flex-wrap justify-center gap-4 mt-3 text-sm">
				{#if basics.email}
					<span>{basics.email}</span>
				{/if}
				{#if basics.phone}
					<span>{basics.phone}</span>
				{/if}
				{#if basics.location?.city}
					<span>
						{basics.location.city}{basics.location.region ? `, ${basics.location.region}` : ''}
					</span>
				{/if}
				{#if basics.url}
					<a href={basics.url} class="text-blue-600 hover:underline">{basics.url}</a>
				{/if}
			</div>

			{#if basics.profiles && basics.profiles.length > 0}
				<div class="flex flex-wrap justify-center gap-4 mt-2 text-sm">
					{#each basics.profiles as profile}
						{#if profile.url}
							<a href={profile.url} class="text-blue-600 hover:underline">
								{profile.network}
							</a>
						{/if}
					{/each}
				</div>
			{/if}
		</header>
	{/if}

	<!-- Summary -->
	{#if shouldShowSection('Summary') && basics.summary}
		<section class="mb-6">
			<h2 class="text-lg font-bold uppercase border-b border-black pb-1 mb-3">Summary</h2>
			<p class="text-sm leading-relaxed">{basics.summary}</p>
		</section>
	{/if}

	<!-- Work Experience -->
	{#if shouldShowSection('Work') && resume.work && resume.work.length > 0}
		<section class="mb-6">
			<h2 class="text-lg font-bold uppercase border-b border-black pb-1 mb-3">Experience</h2>
			{#each resume.work as job}
				<div class="mb-4">
					<div class="flex justify-between items-start">
						<div>
							<h3 class="font-bold">{job.position}</h3>
							<p class="text-gray-700">{job.name}</p>
						</div>
						<span class="text-sm text-gray-600 whitespace-nowrap">
							{formatDateRange(job.startDate, job.endDate, job.endDateCurrent)}
						</span>
					</div>
					{#if job.highlights && job.highlights.length > 0}
						<ul class="list-disc list-inside mt-2 text-sm space-y-1">
							{#each job.highlights as highlight}
								{#if highlight}
									<li>{highlight}</li>
								{/if}
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
			<h2 class="text-lg font-bold uppercase border-b border-black pb-1 mb-3">Education</h2>
			{#each resume.education as edu}
				<div class="mb-4">
					<div class="flex justify-between items-start">
						<div>
							<h3 class="font-bold">{edu.institution}</h3>
							<p class="text-gray-700">
								{edu.studyType}{edu.area ? ` in ${edu.area}` : ''}
								{edu.score ? ` | GPA: ${edu.score}` : ''}
							</p>
						</div>
						<span class="text-sm text-gray-600 whitespace-nowrap">
							{formatDateRange(edu.startDate, edu.endDate, edu.endDateCurrent)}
						</span>
					</div>
					{#if edu.highlights && edu.highlights.length > 0}
						<ul class="list-disc list-inside mt-2 text-sm space-y-1">
							{#each edu.highlights as highlight}
								{#if highlight}
									<li>{highlight}</li>
								{/if}
							{/each}
						</ul>
					{/if}
				</div>
			{/each}
		</section>
	{/if}

	<!-- Skills -->
	{#if shouldShowSection('Skills') && resume.skills && resume.skills.length > 0}
		<section class="mb-6">
			<h2 class="text-lg font-bold uppercase border-b border-black pb-1 mb-3">Skills</h2>
			<div class="space-y-2">
				{#each resume.skills as skill}
					<div class="text-sm">
						<span class="font-medium">{skill.name}:</span>
						{#if skill.keywords && skill.keywords.length > 0}
							<span class="text-gray-700">{skill.keywords.join(', ')}</span>
						{/if}
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Projects -->
	{#if shouldShowSection('Projects') && resume.projects && resume.projects.length > 0}
		<section class="mb-6">
			<h2 class="text-lg font-bold uppercase border-b border-black pb-1 mb-3">Projects</h2>
			{#each resume.projects as project}
				<div class="mb-4">
					<div class="flex justify-between items-start">
						<div>
							<h3 class="font-bold">
								{project.name}
								{#if project.url}
									<a href={project.url} class="text-blue-600 hover:underline text-sm font-normal ml-2">
										Link
									</a>
								{/if}
							</h3>
						</div>
						{#if project.startDate || project.endDate}
							<span class="text-sm text-gray-600 whitespace-nowrap">
								{formatDateRange(project.startDate, project.endDate, project.endDateCurrent)}
							</span>
						{/if}
					</div>
					{#if project.highlights && project.highlights.length > 0}
						<ul class="list-disc list-inside mt-2 text-sm space-y-1">
							{#each project.highlights as highlight}
								{#if highlight}
									<li>{highlight}</li>
								{/if}
							{/each}
						</ul>
					{/if}
				</div>
			{/each}
		</section>
	{/if}

	<!-- Volunteer -->
	{#if shouldShowSection('Volunteer') && resume.volunteer && resume.volunteer.length > 0}
		<section class="mb-6">
			<h2 class="text-lg font-bold uppercase border-b border-black pb-1 mb-3">Volunteer Experience</h2>
			{#each resume.volunteer as vol}
				<div class="mb-4">
					<div class="flex justify-between items-start">
						<div>
							<h3 class="font-bold">{vol.position}</h3>
							<p class="text-gray-700">{vol.organization}</p>
						</div>
						<span class="text-sm text-gray-600 whitespace-nowrap">
							{formatDateRange(vol.startDate, vol.endDate, vol.endDateCurrent)}
						</span>
					</div>
					{#if vol.highlights && vol.highlights.length > 0}
						<ul class="list-disc list-inside mt-2 text-sm space-y-1">
							{#each vol.highlights as highlight}
								{#if highlight}
									<li>{highlight}</li>
								{/if}
							{/each}
						</ul>
					{/if}
				</div>
			{/each}
		</section>
	{/if}

	<!-- Awards -->
	{#if shouldShowSection('Awards') && resume.awards && resume.awards.length > 0}
		<section class="mb-6">
			<h2 class="text-lg font-bold uppercase border-b border-black pb-1 mb-3">Awards</h2>
			{#each resume.awards as award}
				<div class="mb-2">
					<div class="flex justify-between">
						<span class="font-medium">{award.title}</span>
						<span class="text-sm text-gray-600">{award.date}</span>
					</div>
					<p class="text-sm text-gray-700">{award.awarder}</p>
					{#if award.summary}
						<p class="text-sm mt-1">{award.summary}</p>
					{/if}
				</div>
			{/each}
		</section>
	{/if}

	<!-- Certificates -->
	{#if shouldShowSection('Certificates') && resume.certificates && resume.certificates.length > 0}
		<section class="mb-6">
			<h2 class="text-lg font-bold uppercase border-b border-black pb-1 mb-3">Certifications</h2>
			{#each resume.certificates as cert}
				<div class="mb-2 flex justify-between">
					<span class="font-medium">{cert.name}</span>
					<span class="text-sm text-gray-600">{cert.issuer} | {cert.date}</span>
				</div>
			{/each}
		</section>
	{/if}

	<!-- Languages -->
	{#if shouldShowSection('Languages') && resume.languages && resume.languages.length > 0}
		<section class="mb-6">
			<h2 class="text-lg font-bold uppercase border-b border-black pb-1 mb-3">Languages</h2>
			<div class="flex flex-wrap gap-4 text-sm">
				{#each resume.languages as lang}
					<span>{lang.language} ({lang.fluency})</span>
				{/each}
			</div>
		</section>
	{/if}

	<!-- References -->
	{#if shouldShowSection('References') && resume.references && resume.references.length > 0}
		<section class="mb-6">
			<h2 class="text-lg font-bold uppercase border-b border-black pb-1 mb-3">References</h2>
			{#each resume.references as ref}
				<div class="mb-3">
					<p class="font-medium">{ref.name}</p>
					<p class="text-sm text-gray-700 italic">"{ref.reference}"</p>
				</div>
			{/each}
		</section>
	{/if}
</div>

<style>
	.professional-resume {
		line-height: calc(1ex / 0.32);
	}
</style>
