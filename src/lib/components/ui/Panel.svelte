<script lang="ts">
	export let title: string;
	export let collapsible = false;
	let open = true;
</script>

<section class="panel overflow-hidden">
	<header class="flex items-center justify-between px-3.5 py-2.5 border-b border-ink-600">
		<h2 class="eyebrow !text-fg-muted">{title}</h2>
		{#if collapsible}
			<button class="text-fg-faint hover:text-fg" on:click={() => (open = !open)} aria-label="Toggle panel">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
					style="transform: rotate({open ? 90 : 0}deg); transition: transform .15s">
					<path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</button>
		{/if}
	</header>
	{#if open}
		<div class="p-3.5">
			<slot />
		</div>
	{/if}
</section>
