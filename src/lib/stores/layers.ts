import { writable } from 'svelte/store';
import { LAYERS, type LayerId } from '$lib/config/layers';

export interface LayerState {
	visible: boolean;
	opacity: number;
}

function initial(): Record<LayerId, LayerState> {
	const state = {} as Record<LayerId, LayerState>;
	for (const l of LAYERS) state[l.id] = { visible: l.defaultVisible, opacity: 1 };
	return state;
}

function createLayerStore() {
	const { subscribe, update } = writable<Record<LayerId, LayerState>>(initial());

	return {
		subscribe,
		toggle: (id: LayerId) =>
			update((s) => ({ ...s, [id]: { ...s[id], visible: !s[id].visible } })),
		setOpacity: (id: LayerId, opacity: number) =>
			update((s) => ({ ...s, [id]: { ...s[id], opacity } })),
		show: (id: LayerId) => update((s) => ({ ...s, [id]: { ...s[id], visible: true } }))
	};
}

export const layers = createLayerStore();
