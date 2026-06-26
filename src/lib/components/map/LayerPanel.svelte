<script lang="ts">
	import { LAYERS, LAYER_GROUPS, type LayerGroup } from '$lib/config/layers';
	import { layers } from '$lib/stores/layers';

	const groups = Object.keys(LAYER_GROUPS) as LayerGroup[];
	function inGroup(g: LayerGroup) {
		return LAYERS.filter((l) => l.group === g);
	}
</script>

<div class="space-y-4">
	{#each groups as group}
		<div>
			<p class="eyebrow mb-2">{LAYER_GROUPS[group]}</p>
			<ul class="space-y-1.5">
				{#each inGroup(group) as layer}
					{@const state = $layers[layer.id]}
					<li class="rounded-lg px-2 py-1.5 hover:bg-ink-800/60 transition-colors">
						<div class="flex items-center gap-2.5">
							<button
								role="switch"
								aria-checked={state.visible}
								aria-label={`Toggle ${layer.label}`}
								class="relative h-4 w-7 shrink-0 rounded-full transition-colors {state.visible
									? 'bg-accent'
									: 'bg-ink-600'}"
								on:click={() => layers.toggle(layer.id)}
							>
								<span
									class="absolute top-0.5 h-3 w-3 rounded-full bg-ink-950 transition-all"
									style="left:{state.visible ? '14px' : '2px'}"
								></span>
							</button>
							<span
								class="h-3 w-3 shrink-0 rounded-sm border border-ink-600"
								style="background:{layer.swatch}"
							></span>
							<span class="flex-1 text-sm {state.visible ? 'text-fg' : 'text-fg-muted'}"
								>{layer.label}</span
							>
						</div>
						{#if state.visible}
							<div class="mt-1.5 flex items-center gap-2 pl-[38px]">
								<input
									type="range"
									min="0.2"
									max="1"
									step="0.1"
									value={state.opacity}
									aria-label={`${layer.label} opacity`}
									class="h-1 flex-1 cursor-pointer accent-accent"
									on:input={(e) => layers.setOpacity(layer.id, +e.currentTarget.value)}
								/>
								<span class="tnum w-8 text-right text-[10px] text-fg-faint"
									>{Math.round(state.opacity * 100)}%</span
								>
							</div>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>
