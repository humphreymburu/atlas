import type { Feature, Polygon, Point } from 'geojson';

export type ProjectStatus = 'planned' | 'active' | 'completed' | 'stalled';
export type Sector =
	| 'health'
	| 'education'
	| 'water'
	| 'infrastructure'
	| 'agriculture'
	| 'climate'
	| 'energy';

export interface NeedScoreComponents {
	populationDensity: number; // 0..1 normalised, higher = more need
	poverty: number;
	climateRisk: number;
	distanceToHospital: number;
	distanceToSchool: number;
	noActiveProjects: number;
}

export interface County {
	id: string;
	name: string;
	code: string;
	population: number;
	povertyRate: number; // 0..1
	hospitals: number;
	schools: number;
	roadLengthKm: number;
	activeProjects: number;
	totalFunding: number; // USD
	needScore: number; // 0..100
	components: NeedScoreComponents;
	centroid: [number, number]; // [lng, lat]
	boundary?: [number, number][] | null;
}

export interface Facility {
	id: string;
	name: string;
	type: 'hospital' | 'school';
	countyId: string;
	coordinates: [number, number];
}

export interface Project {
	id: string;
	title: string;
	budget: number;
	donor: string;
	implementer: string;
	startDate: string;
	endDate: string;
	beneficiaries: number;
	status: ProjectStatus;
	sector: Sector;
	countyId: string;
	coordinates: [number, number];
	sdgs: number[];
	description: string;
}

export interface Stats {
	population: number;
	hospitals: number;
	schools: number;
	roadLengthKm: number;
	projects: number;
	totalFunding: number;
	fundingBySector: Record<Sector, number>;
	projectsByDonor: Record<string, number>;
}

export type CountyFeature = Feature<Polygon, { id: string; name: string; needScore: number }>;
export type FacilityFeature = Feature<Point, { id: string; name: string; type: string }>;
export type ProjectFeature = Feature<
	Point,
	{ id: string; title: string; sector: Sector; status: ProjectStatus }
>;

export interface SearchResult {
	id: string;
	label: string;
	kind: 'county' | 'hospital' | 'school' | 'project';
	coordinates: [number, number];
}
