import { writable } from 'svelte/store';

const MAX_RECENT = 5;

function createRecent() {
	const { subscribe, update } = writable<string[]>([]);
	return {
		subscribe,
		add: (term: string) =>
			update((list) => {
				const trimmed = term.trim();
				if (!trimmed) return list;
				return [trimmed, ...list.filter((t) => t !== trimmed)].slice(0, MAX_RECENT);
			})
	};
}

export const recentSearches = createRecent();
