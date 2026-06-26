<script lang="ts">
	import type { NeedScoreComponents } from '$lib/types';
	import { COMPONENT_LABELS, DEFAULT_WEIGHTS, bandFor } from '$lib/config/needScore';
	import { formatPercent } from '$lib/utils/format';

	export let components: NeedScoreComponents;
	export let score: number;

	$: band = bandFor(score);
	$: rows = (Object.keys(components) as (keyof NeedScoreComponents)[]).map((k) => ({
		key: k,
		label: COMPONENT_LABELS[k],
		value: components[k],
		weight: DEFAULT_WEIGHTS[k]
	}));
</script>

<div>
	<div class="flex items-baseline gap-2">
		<span class="tnum text-3xl font-semibold" style="color:{band.color}">{score}</span>
		<span class="text-sm text-fg-muted">/ 100</span>
		<span
			class="ml-auto rounded-full px-2 py-0.5 text-[11px] font-medium"
			style="background:{band.color}22;color:{band.color}">{band.label}</span
		>
	</div>

	<div class="mt-3 space-y-2">
		{#each rows as r}
			<div>
				<div class="mb-1 flex items-center justify-between text-[11px]">
					<span class="text-fg-muted">{r.label}</span>
					<span class="tnum text-fg-faint">{formatPercent(r.value)} · w{r.weight}</span>
				</div>
				<div class="h-1.5 overflow-hidden rounded-full bg-ink-700">
					<div class="h-full rounded-full bg-accent/70" style="width:{r.value * 100}%"></div>
				</div>
			</div>
		{/each}
	</div>

	<p class="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-fg-faint">
		<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" class="mt-px shrink-0">
			<circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-8h.01" stroke-linecap="round" />
		</svg>
		Decision-support only. Default weights are an assumption pending calibration — adjust before
		operational use.
	</p>
</div>
