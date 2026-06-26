import { writable, derived } from 'svelte/store';
import type { County, Project, ProjectStatus, Sector } from '$lib/types';

export interface FilterState {
	sectors: Set<Sector>;
	statuses: Set<ProjectStatus>;
	donors: Set<string>;
	minNeedScore: number;
	yearFrom: number;
	yearTo: number;
}

export const DEFAULT_FILTERS: FilterState = {
	sectors: new Set(),
	statuses: new Set(),
	donors: new Set(),
	minNeedScore: 0,
	yearFrom: 2018,
	yearTo: 2027
};

function createFilters() {
	const { subscribe, update, set } = writable<FilterState>({ ...DEFAULT_FILTERS });

	function toggleIn<T>(setRef: Set<T>, value: T): Set<T> {
		const next = new Set(setRef);
		next.has(value) ? next.delete(value) : next.add(value);
		return next;
	}

	return {
		subscribe,
		toggleSector: (s: Sector) => update((f) => ({ ...f, sectors: toggleIn(f.sectors, s) })),
		toggleStatus: (s: ProjectStatus) => update((f) => ({ ...f, statuses: toggleIn(f.statuses, s) })),
		toggleDonor: (d: string) => update((f) => ({ ...f, donors: toggleIn(f.donors, d) })),
		setMinNeedScore: (n: number) => update((f) => ({ ...f, minNeedScore: n })),
		setYears: (from: number, to: number) => update((f) => ({ ...f, yearFrom: from, yearTo: to })),
		reset: () => set({ ...DEFAULT_FILTERS, sectors: new Set(), statuses: new Set(), donors: new Set() })
	};
}

export const filters = createFilters();

export function applyProjectFilters(projects: Project[], f: FilterState, counties: County[] = []): Project[] {
	const needByCounty = new Map(counties.map((c) => [c.id, c.needScore]));
	return projects.filter((p) => {
		if (f.sectors.size && !f.sectors.has(p.sector)) return false;
		if (f.statuses.size && !f.statuses.has(p.status)) return false;
		if (f.donors.size && !f.donors.has(p.donor)) return false;
		if (f.minNeedScore > 0 && (needByCounty.get(p.countyId) ?? 0) < f.minNeedScore) return false;
		const year = new Date(p.startDate).getFullYear();
		if (year < f.yearFrom || year > f.yearTo) return false;
		return true;
	});
}

export const activeFilterCount = derived(filters, (f) => {
	let n = f.sectors.size + f.statuses.size + f.donors.size;
	if (f.minNeedScore > 0) n += 1;
	if (f.yearFrom !== DEFAULT_FILTERS.yearFrom || f.yearTo !== DEFAULT_FILTERS.yearTo) n += 1;
	return n;
});
