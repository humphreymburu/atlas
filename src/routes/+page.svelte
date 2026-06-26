<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import MapCanvas from '$lib/components/map/MapCanvas.svelte';
	import MapLegend from '$lib/components/map/MapLegend.svelte';
	import LayerPanel from '$lib/components/map/LayerPanel.svelte';
	import FilterPanel from '$lib/components/filters/FilterPanel.svelte';
	import SearchBar from '$lib/components/search/SearchBar.svelte';
	import StatisticsDashboard from '$lib/components/dashboard/StatisticsDashboard.svelte';
	import ProjectDetail from '$lib/components/projects/ProjectDetail.svelte';

	import { filters, applyProjectFilters, activeFilterCount } from '$lib/stores/filters';
	import {
		fetchCounties,
		fetchProjects,
		fetchFacilities,
		computeStats,
		countiesToGeoJSON,
		projectsToGeoJSON,
		facilitiesToGeoJSON,
		buildSearchIndex,
		USE_MOCK
	} from '$lib/services/resources';
	import { exportCountiesCSV, exportProjectsCSV, exportGeoJSON } from '$lib/services/export';

	type Tab = 'layers' | 'filters' | 'insights';
	let tab: Tab = 'layers';
	let sidebarOpen = true;
	let exportOpen = false;

	const countiesQuery = createQuery({ queryKey: ['counties'], queryFn: fetchCounties });
	const projectsQuery = createQuery({ queryKey: ['projects'], queryFn: fetchProjects });
	const facilitiesQuery = createQuery({ queryKey: ['facilities'], queryFn: fetchFacilities });

	$: counties = $countiesQuery.data ?? [];
	$: allProjects = $projectsQuery.data ?? [];
	$: facilities = $facilitiesQuery.data ?? [];
	$: loading = $countiesQuery.isLoading || $projectsQuery.isLoading || $facilitiesQuery.isLoading;

	$: filteredProjects = applyProjectFilters(allProjects, $filters, counties);
	$: stats = computeStats(counties, filteredProjects);

	$: countiesGeo = countiesToGeoJSON(counties);
	$: projectsGeo = projectsToGeoJSON(filteredProjects);
	$: facilitiesGeo = facilitiesToGeoJSON(facilities);
	$: searchIndex = buildSearchIndex(counties, facilities, allProjects);

	$: exportActions = [
		{ label: 'Counties (CSV)', run: () => exportCountiesCSV(counties) },
		{ label: 'Projects (CSV)', run: () => exportProjectsCSV(filteredProjects) },
		{ label: 'Boundaries (GeoJSON)', run: () => exportGeoJSON(counties) }
	];

	const TABS: { id: Tab; label: string; icon: 'layers' | 'filter' | 'chart' }[] = [
		{ id: 'layers', label: 'Layers', icon: 'layers' },
		{ id: 'filters', label: 'Filters', icon: 'filter' },
		{ id: 'insights', label: 'Insights', icon: 'chart' }
	];
</script>

<svelte:head>
	<title>AtlasAid — Development Intelligence</title>
</svelte:head>

<div class="flex h-dvh min-h-0 flex-col overflow-hidden bg-ink-950">
	<!-- top bar -->
	<header class="z-30 flex items-center gap-3 border-b border-ink-600 bg-ink-900 px-3 py-2.5">
		<button
			class="btn-ghost !px-2 md:!hidden"
			on:click={() => (sidebarOpen = !sidebarOpen)}
			aria-label="Toggle panel"
		>
			<Icon name="layers" />
		</button>

		<a href="/" class="flex items-center gap-2.5 pr-2">
			<svg width="24" height="24" viewBox="0 0 32 32" aria-hidden="true">
				<path d="M16 5 25 27 H7 Z" fill="none" stroke="#2DD4BF" stroke-width="2" stroke-linejoin="round" />
				<circle cx="16" cy="19" r="2.4" fill="#2DD4BF" />
			</svg>
			<div class="leading-none">
				<span class="text-[15px] font-semibold tracking-tight text-fg">AtlasAid</span>
				<span class="ml-1 hidden align-middle text-[11px] text-fg-faint sm:inline"
					>Development Intelligence</span
				>
			</div>
		</a>

		<div class="mx-auto w-full max-w-xl">
			<SearchBar index={searchIndex} />
		</div>

		<div class="relative">
			<button class="btn-outline" on:click={() => (exportOpen = !exportOpen)}>
				<Icon name="download" size={16} />
				<span class="hidden sm:inline">Export</span>
			</button>
			{#if exportOpen}
				<button
					class="fixed inset-0 z-10 cursor-default"
					aria-label="Close export menu"
					on:click={() => (exportOpen = false)}
				></button>
				<div class="panel absolute right-0 top-full z-20 mt-1 w-48 py-1">
					{#each exportActions as action}
						<button
							class="block w-full px-3 py-2 text-left text-sm text-fg-muted hover:bg-ink-800 hover:text-fg"
							on:click={() => {
								action.run();
								exportOpen = false;
							}}>{action.label}</button
						>
					{/each}
				</div>
			{/if}
		</div>
	</header>

	<div class="relative flex min-h-0 flex-1 overflow-hidden">
		<!-- sidebar -->
		<aside
			class="absolute z-20 flex h-full w-[340px] max-w-[88vw] flex-col border-r border-ink-600 bg-ink-900 shadow-rail transition-transform md:static md:shadow-none {sidebarOpen
				? 'translate-x-0'
				: '-translate-x-full md:translate-x-0'}"
		>
			<nav class="flex border-b border-ink-600">
				{#each TABS as t}
					<button
						class="relative flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors {tab ===
						t.id
							? 'text-accent'
							: 'text-fg-muted hover:text-fg'}"
						on:click={() => (tab = t.id)}
					>
						<Icon name={t.icon} size={15} />
						{t.label}
						{#if t.id === 'filters' && $activeFilterCount}
							<span class="tnum rounded-full bg-accent px-1.5 text-[10px] text-ink-950">{$activeFilterCount}</span>
						{/if}
						{#if tab === t.id}
							<span class="absolute inset-x-0 bottom-0 h-0.5 bg-accent"></span>
						{/if}
					</button>
				{/each}
			</nav>

			<div class="flex-1 overflow-auto p-3.5">
				{#if loading}
					<div class="grid h-40 place-items-center"><Spinner label="Loading data" /></div>
				{:else if tab === 'layers'}
					<LayerPanel />
				{:else if tab === 'filters'}
					<FilterPanel projects={allProjects} />
				{:else if tab === 'insights'}
					<StatisticsDashboard {stats} />
				{/if}
			</div>

			<footer class="border-t border-ink-600 px-3.5 py-2.5">
				<p class="flex items-center gap-1.5 text-[11px] text-fg-faint">
					<span class="h-1.5 w-1.5 rounded-full {USE_MOCK ? 'bg-need-mid' : 'bg-need-low'}"></span>
					{USE_MOCK ? 'Mock data — set PUBLIC_API_BASE_URL for live' : 'Live API'}
				</p>
			</footer>
		</aside>

		<!-- map -->
		<main class="relative min-h-0 flex-1 overflow-hidden">
			<MapCanvas {countiesGeo} {projectsGeo} {facilitiesGeo} />

			<!-- floating legend -->
			<div class="pointer-events-none absolute bottom-4 left-4 z-10">
				<MapLegend />
			</div>

			<!-- detail drawer -->
			<div class="pointer-events-none absolute right-3 top-3 z-10 flex max-h-[calc(100%-1.5rem)]">
				<ProjectDetail {counties} projects={allProjects} />
			</div>
		</main>
	</div>
</div>
