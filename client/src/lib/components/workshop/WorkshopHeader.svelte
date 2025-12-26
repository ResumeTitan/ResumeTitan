<script lang="ts">
	/**
	 * WorkshopHeader
	 *
	 * Top header for the workshop page with:
	 * - Back to Dashboard link
	 * - Resume name (editable)
	 * - Last saved timestamp
	 * - User presence avatars
	 * - Mode indicator (Editing/Preview)
	 * - Template selector
	 * - Action buttons (Preview, Save, History, Comments, Share, Export)
	 */
	import { createEventDispatcher } from 'svelte';
	import type { WorkshopUser, ResumeType } from '$types';
	import { RESUME_THEMES } from '$config';
	import Button from '$components/ui/Button.svelte';
	import FormDropdown from '$components/forms/FormDropdown.svelte';
	import UserPresenceBar from './UserPresenceBar.svelte';

	export let resume: ResumeType;
	export let users: WorkshopUser[] = [];
	export let lastSaved: Date | null = null;
	export let saving = false;
	export let mode: 'editing' | 'preview' = 'editing';
	export let commentCount = 0;

	const dispatch = createEventDispatcher<{
		save: void;
		togglePreview: void;
		toggleComments: void;
		share: void;
		export: void;
		history: void;
		back: void;
		nameChange: { name: string };
		themeChange: { theme: string };
	}>();

	function formatLastSaved(date: Date | null): string {
		if (!date) return 'Not saved yet';
		return `Auto-saved ${date.toLocaleTimeString()}`;
	}
</script>

<header class="workshop-header bg-white border-b border-gray-200">
	<!-- Row 1: Navigation & Document Info -->
	<div class="flex items-center justify-between px-4 py-2 border-b border-gray-100">
		<!-- Left: Back & Title -->
		<div class="flex items-center gap-4">
			<button
				class="flex items-center gap-1 text-gray-600 hover:text-main-green transition-colors text-sm"
				on:click={() => dispatch('back')}
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
				Back to Dashboard
			</button>

			<div class="flex items-center gap-2">
				<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
				<input
					type="text"
					value={resume.name}
					on:input={(e) => dispatch('nameChange', { name: e.currentTarget.value })}
					class="text-lg font-semibold bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-main-green focus:outline-none px-1 max-w-md"
					placeholder="Resume Name"
				/>
				<button class="p-1 text-gray-400 hover:text-gray-600" title="Edit name">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
					</svg>
				</button>
			</div>
		</div>

		<!-- Right: Last Saved & Users -->
		<div class="flex items-center gap-4">
			<span class="text-sm text-gray-400 flex items-center gap-1">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				{formatLastSaved(lastSaved)}
			</span>

			<UserPresenceBar {users} />
		</div>
	</div>

	<!-- Row 2: Mode & Actions -->
	<div class="flex items-center justify-between px-4 py-2">
		<!-- Left: Mode Badge & Auto-save Status -->
		<div class="flex items-center gap-4">
			<span
				class="px-3 py-1 text-xs font-medium rounded-full"
				class:bg-main-green={mode === 'editing'}
				class:text-white={mode === 'editing'}
				class:bg-gray-100={mode === 'preview'}
				class:text-gray-600={mode === 'preview'}
			>
				{mode === 'editing' ? 'Editing' : 'Preview'}
			</span>

			<!-- Template Selector -->
			<div class="flex items-center gap-2">
				<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
				</svg>
				<span class="text-sm text-gray-600">Template:</span>
				<select
					value={resume.theme}
					on:change={(e) => dispatch('themeChange', { theme: e.currentTarget.value })}
					class="text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-main-green"
				>
					{#each RESUME_THEMES as theme}
						<option value={theme.value}>{theme.label}</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- Right: Action Buttons -->
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="sm" on:click={() => dispatch('togglePreview')}>
				<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
				</svg>
				Preview
			</Button>

			<Button variant="primary" size="sm" loading={saving} on:click={() => dispatch('save')}>
				<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
				</svg>
				Save
			</Button>

			<div class="h-6 w-px bg-gray-200 mx-1"></div>

			<Button variant="ghost" size="sm" on:click={() => dispatch('history')}>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				History
			</Button>

			<Button variant="ghost" size="sm" on:click={() => dispatch('toggleComments')}>
				<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
				</svg>
				Comments
				{#if commentCount > 0}
					<span class="ml-1 bg-main-green text-white text-xs px-1.5 py-0.5 rounded-full">
						{commentCount}
					</span>
				{/if}
			</Button>

			<Button variant="ghost" size="sm" on:click={() => dispatch('share')}>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
				</svg>
				Share
			</Button>

			<Button variant="ghost" size="sm" on:click={() => dispatch('export')}>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
				</svg>
				Export
			</Button>

			<!-- More Menu -->
			<button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
				</svg>
			</button>
		</div>
	</div>
</header>
