<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import NeedScoreBreakdown from './NeedScoreBreakdown.svelte';
	import { selection, flyTo } from '$lib/stores/selection';
	import type { County, Project } from '$lib/types';
	import { formatNumber, formatUSD, formatPercent, formatDate, titleCase } from '$lib/utils/format';

	export let counties: County[] = [];
	export let projects: Project[] = [];

	$: county =
		$selection?.kind === 'county' ? counties.find((c) => c.id === $selection.id) ?? null : null;
	$: project =
		$selection?.kind === 'project' ? projects.find((p) => p.id === $selection.id) ?? null : null;
	$: countyProjects = county ? projects.filter((p) => p.countyId === county.id) : [];

	const STATUS_COLOR: Record<string, string> = {
		active: '#22C55E',
		planned: '#EAB308',
		completed: '#60A5FA',
		stalled: '#EF4444'
	};

	function close() {
		selection.set(null);
	}
</script>

{#if county || project}
	<aside
		class="panel pointer-events-auto flex max-h-full w-[340px] flex-col overflow-hidden"
		aria-label="Detail"
	>
		<header class="flex items-start justify-between gap-2 border-b border-ink-600 px-4 py-3">
			<div>
				<p class="eyebrow">{county ? 'County' : 'Project'}</p>
				<h2 class="mt-0.5 text-base font-semibold text-fg leading-tight">
					{county ? county.name : project?.title}
				</h2>
			</div>
			<button class="btn-ghost !p-1.5" on:click={close} aria-label="Close detail">
				<Icon name="close" size={18} />
			</button>
		</header>

		<div class="flex-1 overflow-auto px-4 py-4">
			{#if county}
				<NeedScoreBreakdown components={county.components} score={county.needScore} />

				<div class="mt-5 grid grid-cols-2 gap-2 text-sm">
					<div class="rounded-lg bg-ink-800/60 px-3 py-2">
						<p class="eyebrow">Population</p>
						<p class="tnum mt-0.5 text-fg">{formatNumber(county.population)}</p>
					</div>
					<div class="rounded-lg bg-ink-800/60 px-3 py-2">
						<p class="eyebrow">Poverty</p>
						<p class="tnum mt-0.5 text-fg">{formatPercent(county.povertyRate)}</p>
					</div>
					<div class="rounded-lg bg-ink-800/60 px-3 py-2">
						<p class="eyebrow">Hospitals</p>
						<p class="tnum mt-0.5 text-fg">{county.hospitals}</p>
					</div>
					<div class="rounded-lg bg-ink-800/60 px-3 py-2">
						<p class="eyebrow">Schools</p>
						<p class="tnum mt-0.5 text-fg">{county.schools}</p>
					</div>
					<div class="rounded-lg bg-ink-800/60 px-3 py-2">
						<p class="eyebrow">Active projects</p>
						<p class="tnum mt-0.5 text-fg">{county.activeProjects}</p>
					</div>
					<div class="rounded-lg bg-ink-800/60 px-3 py-2">
						<p class="eyebrow">Funding</p>
						<p class="tnum mt-0.5 text-fg">{formatUSD(county.totalFunding)}</p>
					</div>
				</div>

				<div class="mt-5">
					<p class="eyebrow mb-2">Projects here ({countyProjects.length})</p>
					<ul class="space-y-1">
						{#each countyProjects.slice(0, 6) as p}
							<li>
								<button
									class="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-fg-muted hover:bg-ink-800 hover:text-fg"
									on:click={() => selection.set({ kind: 'project', id: p.id })}
								>
									<span class="h-2 w-2 shrink-0 rounded-full" style="background:{STATUS_COLOR[p.status]}"></span>
									<span class="flex-1 truncate">{p.title}</span>
									<Icon name="chevron" size={14} />
								</button>
							</li>
						{/each}
					</ul>
				</div>
			{:else if project}
				<div class="flex items-center gap-2">
					<span
						class="rounded-full px-2 py-0.5 text-[11px] font-medium"
						style="background:{STATUS_COLOR[project.status]}22;color:{STATUS_COLOR[project.status]}"
						>{titleCase(project.status)}</span
					>
					<span class="chip">{titleCase(project.sector)}</span>
				</div>

				<p class="mt-3 text-sm leading-relaxed text-fg-muted">{project.description}</p>

				<dl class="mt-4 space-y-2.5 text-sm">
					{#each [['Budget', formatUSD(project.budget)], ['Donor', project.donor], ['Implementer', project.implementer], ['Beneficiaries', formatNumber(project.beneficiaries)], ['Timeline', `${formatDate(project.startDate)} – ${formatDate(project.endDate)}`]] as [k, v]}
						<div class="flex justify-between gap-3 border-b border-ink-700/60 pb-2">
							<dt class="text-fg-faint">{k}</dt>
							<dd class="tnum text-right text-fg">{v}</dd>
						</div>
					{/each}
				</dl>

				<div class="mt-4">
					<p class="eyebrow mb-2">SDGs</p>
					<div class="flex flex-wrap gap-1.5">
						{#each project.sdgs as g}
							<span class="chip tnum !text-accent !border-accent/40">SDG {g}</span>
						{/each}
					</div>
				</div>

				<button class="btn-outline mt-5 w-full" on:click={() => flyTo(project.coordinates, 10)}>
					<Icon name="pin" size={16} /> Centre on map
				</button>
			{/if}
		</div>
	</aside>
{/if}
