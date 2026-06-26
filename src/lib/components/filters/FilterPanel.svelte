<script lang="ts">
	import { filters, activeFilterCount } from '$lib/stores/filters';
	import type { Project, Sector, ProjectStatus } from '$lib/types';
	import { titleCase } from '$lib/utils/format';

	export let projects: Project[] = [];

	const SECTORS: Sector[] = [
		'health',
		'education',
		'water',
		'infrastructure',
		'agriculture',
		'climate',
		'energy'
	];
	const STATUSES: ProjectStatus[] = ['planned', 'active', 'completed', 'stalled'];

	$: donors = Array.from(new Set(projects.map((p) => p.donor))).sort();
</script>

<div class="space-y-5">
	<div class="flex items-center justify-between">
		<span class="text-xs text-fg-muted">
			{#if $activeFilterCount}
				<span class="tnum text-accent">{$activeFilterCount}</span> active
			{:else}
				No filters applied
			{/if}
		</span>
		<button
			class="text-xs text-fg-faint hover:text-accent disabled:opacity-40"
			disabled={!$activeFilterCount}
			on:click={() => filters.reset()}>Reset</button
		>
	</div>

	<div>
		<p class="eyebrow mb-2">Sector</p>
		<div class="flex flex-wrap gap-1.5">
			{#each SECTORS as s}
				<button
					class="chip transition-colors {$filters.sectors.has(s)
						? '!border-accent !text-accent !bg-accent/10'
						: 'hover:border-line'}"
					on:click={() => filters.toggleSector(s)}>{titleCase(s)}</button
				>
			{/each}
		</div>
	</div>

	<div>
		<p class="eyebrow mb-2">Status</p>
		<div class="flex flex-wrap gap-1.5">
			{#each STATUSES as s}
				<button
					class="chip transition-colors {$filters.statuses.has(s)
						? '!border-accent !text-accent !bg-accent/10'
						: 'hover:border-line'}"
					on:click={() => filters.toggleStatus(s)}>{titleCase(s)}</button
				>
			{/each}
		</div>
	</div>

	<div>
		<p class="eyebrow mb-2">Donor</p>
		<div class="flex flex-wrap gap-1.5">
			{#each donors as d}
				<button
					class="chip transition-colors {$filters.donors.has(d)
						? '!border-accent !text-accent !bg-accent/10'
						: 'hover:border-line'}"
					on:click={() => filters.toggleDonor(d)}>{d}</button
				>
			{/each}
		</div>
	</div>

	<div>
		<div class="mb-2 flex items-center justify-between">
			<p class="eyebrow">Minimum Need Score</p>
			<span class="tnum text-xs text-fg-muted">{$filters.minNeedScore}</span>
		</div>
		<input
			type="range"
			min="0"
			max="100"
			step="5"
			value={$filters.minNeedScore}
			class="h-1 w-full accent-accent"
			aria-label="Minimum Need Score"
			on:input={(e) => filters.setMinNeedScore(+e.currentTarget.value)}
		/>
	</div>

	<div>
		<div class="mb-2 flex items-center justify-between">
			<p class="eyebrow">Project start year</p>
			<span class="tnum text-xs text-fg-muted">{$filters.yearFrom}–{$filters.yearTo}</span>
		</div>
		<div class="flex items-center gap-2">
			<input
				type="range"
				min="2018"
				max="2027"
				value={$filters.yearFrom}
				class="h-1 flex-1 accent-accent"
				aria-label="Year from"
				on:input={(e) =>
					filters.setYears(Math.min(+e.currentTarget.value, $filters.yearTo), $filters.yearTo)}
			/>
			<input
				type="range"
				min="2018"
				max="2027"
				value={$filters.yearTo}
				class="h-1 flex-1 accent-accent"
				aria-label="Year to"
				on:input={(e) =>
					filters.setYears($filters.yearFrom, Math.max(+e.currentTarget.value, $filters.yearFrom))}
			/>
		</div>
	</div>
</div>
