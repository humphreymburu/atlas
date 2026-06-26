<script lang="ts">
	export let label: string;
	export let value: string;
	export let sub: string | null = null;
</script>

<div class="rounded-lg border border-ink-600 bg-ink-800/60 px-3 py-2.5">
	<p class="eyebrow">{label}</p>
	<p class="tnum mt-1 text-xl font-semibold text-fg leading-none">{value}</p>
	{#if sub}
		<p class="mt-1 text-[11px] text-fg-faint">{sub}</p>
	{/if}
</div>
