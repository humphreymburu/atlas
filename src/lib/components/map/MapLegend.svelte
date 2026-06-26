<script lang="ts">
	import { NEED_BANDS } from '$lib/config/needScore';
	import { layers } from '$lib/stores/layers';

	$: visible = $layers['need-score']?.visible;
</script>

{#if visible}
	<div class="panel px-3 py-2.5 pointer-events-auto">
		<p class="eyebrow mb-2">Need Score</p>
		<div class="flex items-center gap-0.5">
			{#each NEED_BANDS as band}
				<div class="flex flex-col items-center gap-1" style="width:46px">
					<span class="h-2 w-full rounded-sm" style="background:{band.color}"></span>
					<span class="text-[10px] text-fg-muted">{band.label}</span>
				</div>
			{/each}
		</div>
		<div class="mt-1.5 flex justify-between tnum text-[10px] text-fg-faint">
			<span>0</span><span>50</span><span>100</span>
		</div>
	</div>
{/if}
