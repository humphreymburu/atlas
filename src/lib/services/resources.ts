import { env } from '$env/dynamic/public';
import type {
	County,
	Facility,
	Project,
	Stats,
	Sector,
	SearchResult,
	CountyFeature,
	FacilityFeature,
	ProjectFeature
} from '$lib/types';
import { COUNTIES, COUNTY_POLYGONS, FACILITIES, PROJECTS } from './mock/data';
import { countyListSchema, facilityListSchema, projectListSchema } from '$lib/schemas';
import type { FeatureCollection } from 'geojson';

const API_BASE = env.PUBLIC_API_BASE_URL?.trim() ?? '';
export const USE_MOCK = API_BASE.length === 0;

/** Small simulated latency so loading states are visible against mock data. */
function delay<T>(value: T, ms = 280): Promise<T> {
	return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

async function get<T>(path: string): Promise<T> {
	const res = await fetch(`${API_BASE}${path}`, {
		headers: { Accept: 'application/json' }
	});
	if (!res.ok) {
		throw new Error(`Request to ${path} failed (${res.status})`);
	}
	return (await res.json()) as T;
}

/* ------------------------------------------------------------------ resources */

export async function fetchCounties(): Promise<County[]> {
	if (USE_MOCK) return delay(COUNTIES);
	const raw = await get<unknown>('/counties');
	return countyListSchema.parse(raw) as County[];
}

export async function fetchProjects(): Promise<Project[]> {
	if (USE_MOCK) return delay(PROJECTS);
	const raw = await get<unknown>('/projects');
	return projectListSchema.parse(raw) as Project[];
}

export async function fetchFacilities(): Promise<Facility[]> {
	if (USE_MOCK) return delay(FACILITIES);
	const raw = await get<unknown>('/facilities');
	return facilityListSchema.parse(raw) as Facility[];
}

/* ---------------------------------------------------------------- derived data */

export function computeStats(counties: County[], projects: Project[]): Stats {
	const fundingBySector = {
		health: 0,
		education: 0,
		water: 0,
		infrastructure: 0,
		agriculture: 0,
		climate: 0,
		energy: 0
	} as Record<Sector, number>;
	const projectsByDonor: Record<string, number> = {};

	for (const p of projects) {
		fundingBySector[p.sector] += p.budget;
		projectsByDonor[p.donor] = (projectsByDonor[p.donor] ?? 0) + 1;
	}

	return {
		population: counties.reduce((a, c) => a + c.population, 0),
		hospitals: counties.reduce((a, c) => a + c.hospitals, 0),
		schools: counties.reduce((a, c) => a + c.schools, 0),
		roadLengthKm: counties.reduce((a, c) => a + c.roadLengthKm, 0),
		projects: projects.length,
		totalFunding: projects.reduce((a, p) => a + p.budget, 0),
		fundingBySector,
		projectsByDonor
	};
}

/* ------------------------------------------------------------------- geojson */

export function countiesToGeoJSON(counties: County[]): FeatureCollection {
	return {
		type: 'FeatureCollection',
		features: counties.map((c, i): CountyFeature => {
			const ring = c.boundary?.length ? c.boundary : COUNTY_POLYGONS[i % COUNTY_POLYGONS.length];
			return {
				type: 'Feature',
				properties: { id: c.id, name: c.name, needScore: c.needScore },
				geometry: { type: 'Polygon', coordinates: [ring as [number, number][]] }
			};
		})
	};
}

export function facilitiesToGeoJSON(facilities: Facility[]): FeatureCollection {
	return {
		type: 'FeatureCollection',
		features: facilities.map(
			(f): FacilityFeature => ({
				type: 'Feature',
				properties: { id: f.id, name: f.name, type: f.type },
				geometry: { type: 'Point', coordinates: f.coordinates }
			})
		)
	};
}

export function projectsToGeoJSON(projects: Project[]): FeatureCollection {
	return {
		type: 'FeatureCollection',
		features: projects.map(
			(p): ProjectFeature => ({
				type: 'Feature',
				properties: { id: p.id, title: p.title, sector: p.sector, status: p.status },
				geometry: { type: 'Point', coordinates: p.coordinates }
			})
		)
	};
}

/* -------------------------------------------------------------------- search */

export function buildSearchIndex(
	counties: County[],
	facilities: Facility[],
	projects: Project[]
): SearchResult[] {
	return [
		...counties.map((c): SearchResult => ({ id: c.id, label: c.name, kind: 'county', coordinates: c.centroid })),
		...facilities.map(
			(f): SearchResult => ({ id: f.id, label: f.name, kind: f.type, coordinates: f.coordinates })
		),
		...projects.map(
			(p): SearchResult => ({ id: p.id, label: p.title, kind: 'project', coordinates: p.coordinates })
		)
	];
}
