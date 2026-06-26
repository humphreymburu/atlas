<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { env } from '$env/dynamic/public';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import type { FeatureCollection } from 'geojson';
	import type { Map as MapboxMap, GeoJSONSource } from 'mapbox-gl';
	import { layers } from '$lib/stores/layers';
	import { selection } from '$lib/stores/selection';
	import { flyTarget } from '$lib/stores/selection';
	import { NEED_BANDS } from '$lib/config/needScore';

	export let countiesGeo: FeatureCollection;
	export let projectsGeo: FeatureCollection;
	export let facilitiesGeo: FeatureCollection;

	const TOKEN = env.PUBLIC_MAPBOX_TOKEN?.trim() ?? '';
	export const hasToken = TOKEN.length > 0;

	let container: HTMLDivElement;
	let map: MapboxMap | null = null;
	let loaded = false;
	let mapError = '';
	let unsubs: Array<() => void> = [];
	let resizeObserver: ResizeObserver | null = null;

	const KENYA_CENTER: [number, number] = [37.9, 0.5];

	// data-driven fill colour for the Need Score choropleth (PRD §8.3)
	const needFillColor: any = [
		'step',
		['get', 'needScore'],
		NEED_BANDS[0].color,
		NEED_BANDS[1].min,
		NEED_BANDS[1].color,
		NEED_BANDS[2].min,
		NEED_BANDS[2].color,
		NEED_BANDS[3].min,
		NEED_BANDS[3].color
	];

	onMount(() => {
		if (!hasToken) return;
		let cancelled = false;

		(async () => {
			const mapboxgl = (await import('mapbox-gl')).default;
			if (cancelled) return;

			// mapbox-gl v2 exposed a static supported() check; v3 removed it. Only
			// bail when the method exists and explicitly reports no WebGL.
			const supported = (mapboxgl as { supported?: () => boolean }).supported;
			if (typeof supported === 'function' && !supported()) {
				mapError = 'WebGL is not available in this browser, so the basemap cannot render.';
				console.error('[MapCanvas]', mapError);
				return;
			}

			mapboxgl.accessToken = TOKEN;

			try {
				map = new mapboxgl.Map({
					container,
					style: 'mapbox://styles/mapbox/dark-v11',
					center: KENYA_CENTER,
					zoom: 5.4,
					attributionControl: true
				});
				resizeObserver = new ResizeObserver(() => map?.resize());
				resizeObserver.observe(container);
			} catch (err) {
				mapError = err instanceof Error ? err.message : String(err);
				console.error('[MapCanvas] map init failed:', err);
				return;
			}

			// Surface style/tile/network failures that otherwise leave a blank canvas.
			map.on('error', (e) => {
				const msg = (e as { error?: Error }).error?.message ?? 'Unknown map error';
				mapError = msg;
				console.error('[MapCanvas] mapbox error:', msg, e);
			});

			map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');
			map.addControl(new mapboxgl.ScaleControl({ unit: 'metric' }), 'bottom-left');

			map.on('load', () => {
				if (!map) return;
				map.addSource('counties', { type: 'geojson', data: countiesGeo });
				map.addSource('projects', { type: 'geojson', data: projectsGeo });
				map.addSource('facilities', { type: 'geojson', data: facilitiesGeo });

				map.addLayer({
					id: 'need-score',
					type: 'fill',
					source: 'counties',
					paint: { 'fill-color': needFillColor, 'fill-opacity': 0.55 }
				});
				map.addLayer({
					id: 'admin-boundaries',
					type: 'line',
					source: 'counties',
					paint: { 'line-color': '#5EEAD4', 'line-width': 1.1, 'line-opacity': 0.7 }
				});
				map.addLayer({
					id: 'county-selected',
					type: 'line',
					source: 'counties',
					paint: { 'line-color': '#2DD4BF', 'line-width': 2.6 },
					filter: ['==', ['get', 'id'], '__none__']
				});

				map.addLayer({
					id: 'hospitals',
					type: 'circle',
					source: 'facilities',
					filter: ['==', ['get', 'type'], 'hospital'],
					paint: {
						'circle-radius': 4,
						'circle-color': '#60A5FA',
						'circle-stroke-color': '#0B1220',
						'circle-stroke-width': 1
					}
				});
				map.addLayer({
					id: 'schools',
					type: 'circle',
					source: 'facilities',
					filter: ['==', ['get', 'type'], 'school'],
					paint: {
						'circle-radius': 3.5,
						'circle-color': '#A78BFA',
						'circle-stroke-color': '#0B1220',
						'circle-stroke-width': 1
					}
				});
				map.addLayer({
					id: 'projects',
					type: 'circle',
					source: 'projects',
					paint: {
						'circle-radius': 5,
						'circle-color': '#2DD4BF',
						'circle-stroke-color': '#06241F',
						'circle-stroke-width': 1.4
					}
				});

				loaded = true;
				map.resize();
				syncLayerVisibility();

				// interactions
				map.on('click', 'need-score', (e) => {
					const f = e.features?.[0] as { properties?: Record<string, unknown> } | undefined;
					if (f?.properties) selection.set({ kind: 'county', id: String(f.properties.id) });
				});
				map.on('click', 'projects', (e) => {
					const f = e.features?.[0] as { properties?: Record<string, unknown> } | undefined;
					if (f?.properties) selection.set({ kind: 'project', id: String(f.properties.id) });
				});
				for (const id of ['need-score', 'projects', 'hospitals', 'schools']) {
					map.on('mouseenter', id, () => map && (map.getCanvas().style.cursor = 'pointer'));
					map.on('mouseleave', id, () => map && (map.getCanvas().style.cursor = ''));
				}
			});

			// store subscriptions
			unsubs.push(layers.subscribe(() => syncLayerVisibility()));
			unsubs.push(
				selection.subscribe((sel) => {
					if (!map || !loaded) return;
					map.setFilter('county-selected', [
						'==',
						['get', 'id'],
						sel?.kind === 'county' ? sel.id : '__none__'
					]);
				})
			);
			unsubs.push(
				flyTarget.subscribe((t) => {
					if (!map || !t) return;
					map.flyTo({ center: t.coordinates, zoom: t.zoom ?? 8, essential: true });
					flyTarget.set(null);
				})
			);
		})();

		return () => {
			cancelled = true;
		};
	});

	function syncLayerVisibility() {
		if (!map || !loaded) return;
		const state = get(layers);
		for (const id of Object.keys(state)) {
			if (!map.getLayer(id)) continue;
			map.setLayoutProperty(id, 'visibility', state[id as keyof typeof state].visible ? 'visible' : 'none');
			const op = state[id as keyof typeof state].opacity;
			if (id === 'need-score') map.setPaintProperty(id, 'fill-opacity', 0.55 * op);
			else if (id === 'admin-boundaries') map.setPaintProperty(id, 'line-opacity', 0.7 * op);
			else if (map.getLayer(id)) {
				try {
					map.setPaintProperty(id, 'circle-opacity', op);
				} catch {
					/* line/fill layers ignore */
				}
			}
		}
	}

	// reactive data updates
	$: updateSource('counties', countiesGeo);
	$: updateSource('projects', projectsGeo);
	$: updateSource('facilities', facilitiesGeo);

	function updateSource(id: string, data: FeatureCollection) {
		if (!map || !loaded) return;
		const src = map.getSource(id) as GeoJSONSource | undefined;
		if (src) src.setData(data as any);
	}

	onDestroy(() => {
		unsubs.forEach((u) => u());
		resizeObserver?.disconnect();
		map?.remove();
		map = null;
	});
</script>

<div class="absolute inset-0 h-full w-full" bind:this={container} aria-label="Interactive map"></div>

{#if !hasToken}
	<div class="absolute inset-0 grid place-items-center bg-ink-950 px-6 text-center">
		<div class="max-w-md">
			<div class="mx-auto mb-4 h-12 w-12 rounded-xl border border-ink-600 grid place-items-center text-accent">
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
					<path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11Z" stroke-linejoin="round" />
					<circle cx="12" cy="10" r="2.4" />
				</svg>
			</div>
			<p class="eyebrow mb-2">Map basemap unavailable</p>
			<p class="text-sm text-fg-muted leading-relaxed">
				Add a Mapbox token to <code class="text-accent">.env</code> as
				<code class="text-accent">PUBLIC_MAPBOX_TOKEN</code> to render the map.
				Every other panel is live on mock data in the meantime.
			</p>
		</div>
	</div>
{:else if mapError}
	<div class="absolute inset-0 grid place-items-center bg-ink-950 px-6 text-center">
		<div class="max-w-md">
			<p class="eyebrow mb-2">Map failed to load</p>
			<p class="text-sm text-fg-muted leading-relaxed">{mapError}</p>
		</div>
	</div>
{/if}
