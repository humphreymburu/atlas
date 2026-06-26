<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import { recentSearches } from '$lib/stores/search';
	import { selection, flyTo } from '$lib/stores/selection';
	import type { SearchResult } from '$lib/types';

	export let index: SearchResult[] = [];

	let query = '';
	let open = false;
	let active = -1;
	let inputEl: HTMLInputElement;

	const KIND_ICON = { county: 'pin', hospital: 'hospital', school: 'school', project: 'project' } as const;

	// lightweight fuzzy: subsequence match + simple scoring
	function score(label: string, q: string): number {
		const l = label.toLowerCase();
		const needle = q.toLowerCase();
		if (l.includes(needle)) return 100 - l.indexOf(needle);
		let qi = 0;
		for (let i = 0; i < l.length && qi < needle.length; i++) if (l[i] === needle[qi]) qi++;
		return qi === needle.length ? 40 - (l.length - needle.length) : -1;
	}

	$: results =
		query.trim().length === 0
			? []
			: index
					.map((r) => ({ r, s: score(r.label, query.trim()) }))
					.filter((x) => x.s >= 0)
					.sort((a, b) => b.s - a.s)
					.slice(0, 8)
					.map((x) => x.r);

	function choose(r: SearchResult) {
		recentSearches.add(r.label);
		flyTo(r.coordinates, r.kind === 'county' ? 7.5 : 10);
		if (r.kind === 'county') selection.set({ kind: 'county', id: r.id });
		else if (r.kind === 'project') selection.set({ kind: 'project', id: r.id });
		query = r.label;
		open = false;
		active = -1;
		inputEl.blur();
	}

	function onKeydown(e: KeyboardEvent) {
		if (!open) return;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			active = Math.min(active + 1, results.length - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			active = Math.max(active - 1, 0);
		} else if (e.key === 'Enter' && active >= 0) {
			e.preventDefault();
			choose(results[active]);
		} else if (e.key === 'Escape') {
			open = false;
		}
	}
</script>

<div class="relative w-full">
	<div
		class="panel flex items-center gap-2 px-3 py-2 {open && (results.length || $recentSearches.length)
			? 'rounded-b-none'
			: ''}"
	>
		<span class="text-fg-faint"><Icon name="search" size={16} /></span>
		<input
			bind:this={inputEl}
			bind:value={query}
			on:focus={() => (open = true)}
			on:blur={() => setTimeout(() => (open = false), 120)}
			on:keydown={onKeydown}
			placeholder="Search counties, hospitals, schools, projects…"
			class="w-full bg-transparent text-sm text-fg placeholder:text-fg-faint focus:outline-none"
			aria-label="Search"
			autocomplete="off"
		/>
		{#if query}
			<button class="text-fg-faint hover:text-fg" on:click={() => (query = '')} aria-label="Clear search">
				<Icon name="close" size={15} />
			</button>
		{/if}
	</div>

	{#if open && (results.length || (query.length === 0 && $recentSearches.length))}
		<ul
			class="panel absolute left-0 right-0 top-full -mt-px max-h-80 overflow-auto rounded-t-none border-t-0 py-1.5"
		>
			{#if results.length}
				{#each results as r, i}
					<li>
						<button
							class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors {i ===
							active
								? 'bg-ink-700 text-fg'
								: 'text-fg-muted hover:bg-ink-800'}"
							on:mousedown={() => choose(r)}
						>
							<span class="text-fg-faint"><Icon name={KIND_ICON[r.kind]} size={15} /></span>
							<span class="flex-1 truncate text-fg">{r.label}</span>
							<span class="eyebrow">{r.kind}</span>
						</button>
					</li>
				{/each}
			{:else}
				<li class="eyebrow px-3 pb-1 pt-1.5">Recent</li>
				{#each $recentSearches as term}
					<li>
						<button
							class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-fg-muted hover:bg-ink-800"
							on:mousedown={() => (query = term)}
						>
							<span class="text-fg-faint"><Icon name="search" size={14} /></span>
							{term}
						</button>
					</li>
				{/each}
			{/if}
		</ul>
	{/if}
</div>
