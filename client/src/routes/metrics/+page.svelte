<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$components/ui/Button.svelte';
	import Alert from '$components/ui/Alert.svelte';
	import { api } from '$lib/api/client';

	interface MetricsData {
		dateRange: {
			start: string;
			end: string;
		};
		newItems: {
			resumes: number;
			editedResumes: number;
			interviews: number;
			coverLetters: number;
		};
		totals: {
			resumes: number;
			editedResumes: number;
			interviews: number;
			coverLetters: number;
		};
		growth: {
			resumes: string;
			editedResumes: string;
			interviews: string;
			coverLetters: string;
		};
	}

	let startDate = '';
	let endDate = '';
	let metrics: MetricsData | null = null;
	let loading = false;
	let error = '';

	// Set default date range to last 30 days
	onMount(() => {
		const end = new Date();
		const start = new Date();
		start.setDate(start.getDate() - 30);

		endDate = end.toISOString().split('T')[0];
		startDate = start.toISOString().split('T')[0];
	});

	async function fetchMetrics() {
		if (!startDate || !endDate) {
			error = 'Please select both start and end dates';
			return;
		}

		loading = true;
		error = '';

		try {
			const response = await api.get<{ success: boolean; data?: MetricsData; error?: string }>(
				`/metrics/date-range?start=${startDate}&end=${endDate}`
			);
			if (response.success && response.data) {
				metrics = response.data;
			} else {
				error = response.error || 'Failed to fetch metrics';
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	}

	$: if (startDate && endDate) {
		fetchMetrics();
	}

	$: chartData = metrics
		? [
				{
					name: 'Resumes',
					new: metrics.newItems.resumes,
					total: metrics.totals.resumes,
					growth: parseFloat(metrics.growth.resumes)
				},
				{
					name: 'Edited Resumes',
					new: metrics.newItems.editedResumes,
					total: metrics.totals.editedResumes,
					growth: parseFloat(metrics.growth.editedResumes)
				},
				{
					name: 'Interviews',
					new: metrics.newItems.interviews,
					total: metrics.totals.interviews,
					growth: parseFloat(metrics.growth.interviews)
				},
				{
					name: 'Cover Letters',
					new: metrics.newItems.coverLetters,
					total: metrics.totals.coverLetters,
					growth: parseFloat(metrics.growth.coverLetters)
				}
			]
		: [];

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString();
	}
</script>

<svelte:head>
	<title>Site Metrics - ResumeTitan</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 p-6">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">Site Metrics</h1>
			<p class="text-gray-600">Track your site's performance and growth over time</p>
		</div>

		<!-- Date Range Selector -->
		<div class="bg-white rounded-lg shadow p-6 mb-6">
			<div class="flex items-center gap-4 flex-wrap">
				<svg class="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
						clip-rule="evenodd"
					/>
				</svg>
				<div>
					<label for="start-date" class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
					<input
						id="start-date"
						type="date"
						bind:value={startDate}
						class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main-green"
					/>
				</div>
				<div>
					<label for="end-date" class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
					<input
						id="end-date"
						type="date"
						bind:value={endDate}
						class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main-green"
					/>
				</div>
				<div class="mt-6">
					<Button variant="primary" on:click={fetchMetrics} disabled={loading}>
						{loading ? 'Loading...' : 'Refresh'}
					</Button>
				</div>
			</div>
		</div>

		{#if error}
			<div class="mb-6">
				<Alert variant="error">{error}</Alert>
			</div>
		{/if}

		{#if metrics}
			<!-- Date Range Display -->
			<div class="mb-6">
				<p class="text-lg font-medium text-gray-700">
					Metrics for {formatDate(metrics.dateRange.start)} - {formatDate(metrics.dateRange.end)}
				</p>
			</div>

			<!-- New Items Cards -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<div class="bg-white rounded-lg shadow p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">New Resumes</p>
							<p class="text-2xl font-bold text-gray-900">
								{metrics.newItems.resumes.toLocaleString()}
							</p>
							<p class="text-xs text-gray-500">{metrics.growth.resumes}% of total</p>
						</div>
						<div class="p-3 rounded-full bg-blue-500">
							<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">Edited Resumes</p>
							<p class="text-2xl font-bold text-gray-900">
								{metrics.newItems.editedResumes.toLocaleString()}
							</p>
							<p class="text-xs text-gray-500">{metrics.growth.editedResumes}% of total</p>
						</div>
						<div class="p-3 rounded-full bg-green-500">
							<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">New Interviews</p>
							<p class="text-2xl font-bold text-gray-900">
								{metrics.newItems.interviews.toLocaleString()}
							</p>
							<p class="text-xs text-gray-500">{metrics.growth.interviews}% of total</p>
						</div>
						<div class="p-3 rounded-full bg-purple-500">
							<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">New Cover Letters</p>
							<p class="text-2xl font-bold text-gray-900">
								{metrics.newItems.coverLetters.toLocaleString()}
							</p>
							<p class="text-xs text-gray-500">{metrics.growth.coverLetters}% of total</p>
						</div>
						<div class="p-3 rounded-full bg-orange-500">
							<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
								<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
							</svg>
						</div>
					</div>
				</div>
			</div>

			<!-- Total Items Cards -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<div class="bg-white rounded-lg shadow p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">Total Resumes</p>
							<p class="text-2xl font-bold text-gray-900">
								{metrics.totals.resumes.toLocaleString()}
							</p>
							<p class="text-xs text-gray-500">All time</p>
						</div>
						<div class="p-3 rounded-full bg-blue-600">
							<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">Total Edited Resumes</p>
							<p class="text-2xl font-bold text-gray-900">
								{metrics.totals.editedResumes.toLocaleString()}
							</p>
							<p class="text-xs text-gray-500">All time</p>
						</div>
						<div class="p-3 rounded-full bg-green-600">
							<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">Total Interviews</p>
							<p class="text-2xl font-bold text-gray-900">
								{metrics.totals.interviews.toLocaleString()}
							</p>
							<p class="text-xs text-gray-500">All time</p>
						</div>
						<div class="p-3 rounded-full bg-purple-600">
							<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">Total Cover Letters</p>
							<p class="text-2xl font-bold text-gray-900">
								{metrics.totals.coverLetters.toLocaleString()}
							</p>
							<p class="text-xs text-gray-500">All time</p>
						</div>
						<div class="p-3 rounded-full bg-orange-600">
							<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
								<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
							</svg>
						</div>
					</div>
				</div>
			</div>

			<!-- Charts Section -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<!-- New Items Chart -->
				<div class="bg-white rounded-lg shadow">
					<div class="p-4 border-b">
						<h3 class="font-semibold text-gray-900">New Items in Date Range</h3>
					</div>
					<div class="p-6">
						<div class="space-y-4">
							{#each chartData as item}
								<div>
									<div class="flex justify-between text-sm mb-1">
										<span class="text-gray-600">{item.name}</span>
										<span class="font-medium">{item.new}</span>
									</div>
									<div class="w-full bg-gray-200 rounded-full h-3">
										<div
											class="bg-blue-500 h-3 rounded-full transition-all duration-300"
											style="width: {Math.min((item.new / Math.max(...chartData.map((d) => d.new), 1)) * 100, 100)}%"
										></div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<!-- Growth Chart -->
				<div class="bg-white rounded-lg shadow">
					<div class="p-4 border-b">
						<h3 class="font-semibold text-gray-900">Growth Percentage</h3>
					</div>
					<div class="p-6">
						<div class="space-y-4">
							{#each chartData as item}
								<div>
									<div class="flex justify-between text-sm mb-1">
										<span class="text-gray-600">{item.name}</span>
										<span class="font-medium">{item.growth}%</span>
									</div>
									<div class="w-full bg-gray-200 rounded-full h-3">
										<div
											class="bg-green-500 h-3 rounded-full transition-all duration-300"
											style="width: {Math.min(item.growth, 100)}%"
										></div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
