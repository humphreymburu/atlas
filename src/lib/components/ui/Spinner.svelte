<script lang="ts">
	export let size = 18;
	export let label = 'Loading';
</script>

<span class="inline-flex items-center gap-2 text-fg-muted text-xs" role="status">
	<svg width={size} height={size} viewBox="0 0 24 24" class="animate-spin" aria-hidden="true">
		<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-opacity="0.2" stroke-width="3" />
		<path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
	</svg>
	<span class="sr-only">{label}</span>
</span>
