import { writable } from 'svelte/store';

export type Selection =
	| { kind: 'county'; id: string }
	| { kind: 'project'; id: string }
	| null;

export const selection = writable<Selection>(null);

/** Coordinate the map should fly to; cleared by the map after it consumes it. */
export const flyTarget = writable<{ coordinates: [number, number]; zoom?: number } | null>(null);

export function flyTo(coordinates: [number, number], zoom = 8) {
	flyTarget.set({ coordinates, zoom });
}
