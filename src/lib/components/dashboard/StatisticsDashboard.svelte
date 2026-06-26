<script lang="ts">
	import StatCard from './StatCard.svelte';
	import BarChart from './BarChart.svelte';
	import type { Stats } from '$lib/types';
	import { formatCompact, formatUSD, titleCase } from '$lib/utils/format';

	export let stats: Stats;

	$: sectorEntries = Object.entries(stats.fundingBySector)
		.filter(([, v]) => v > 0)
		.sort((a, b) => b[1] - a[1]);
	$: donorEntries = Object.entries(stats.projectsByDonor).sort((a, b) => b[1] - a[1]);
</script>

<div class="space-y-4">
	<div class="grid grid-cols-3 gap-2">
		<StatCard label="Population" value={formatCompact(stats.population)} sub="across counties" />
		<StatCard label="Funding" value={formatUSD(stats.totalFunding)} sub="total committed" />
		<StatCard label="Projects" value={String(stats.projects)} sub="in view" />
		<StatCard label="Hospitals" value={formatCompact(stats.hospitals)} />
		<StatCard label="Schools" value={formatCompact(stats.schools)} />
		<StatCard label="Roads" value={`${formatCompact(stats.roadLengthKm)} km`} />
	</div>

	<div>
		<p class="eyebrow mb-2">Funding by sector</p>
		<BarChart
			labels={sectorEntries.map(([k]) => titleCase(k))}
			data={sectorEntries.map(([, v]) => v)}
			valuePrefix="$"
		/>
	</div>

	<div>
		<p class="eyebrow mb-2">Projects by donor</p>
		<BarChart
			labels={donorEntries.map(([k]) => k)}
			data={donorEntries.map(([, v]) => v)}
			color="#5EEAD4"
			horizontal
		/>
	</div>
</div>
