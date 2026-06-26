import type { County, Facility, Project } from '$lib/types';
import { computeNeedScore } from '$lib/config/needScore';
import type { NeedScoreComponents } from '$lib/types';

/**
 * Mock data so the frontend runs end-to-end with no backend.
 * County polygons are deliberately CRUDE placeholder boxes around each centroid —
 * real boundaries come from GADM / Natural Earth / Kenya Open Data (PRD §11).
 * Swap this module out for the live API by setting PUBLIC_API_BASE_URL.
 */

interface Seed {
	id: string;
	name: string;
	code: string;
	centroid: [number, number];
	population: number;
	c: NeedScoreComponents;
}

const seeds: Seed[] = [
	{
		id: 'nairobi',
		name: 'Nairobi',
		code: '047',
		centroid: [36.8219, -1.2921],
		population: 4397073,
		c: { populationDensity: 0.95, poverty: 0.3, climateRisk: 0.2, distanceToHospital: 0.1, distanceToSchool: 0.1, noActiveProjects: 0.1 }
	},
	{
		id: 'mombasa',
		name: 'Mombasa',
		code: '001',
		centroid: [39.6682, -4.0435],
		population: 1208333,
		c: { populationDensity: 0.8, poverty: 0.45, climateRisk: 0.6, distanceToHospital: 0.25, distanceToSchool: 0.3, noActiveProjects: 0.3 }
	},
	{
		id: 'kisumu',
		name: 'Kisumu',
		code: '042',
		centroid: [34.7617, -0.0917],
		population: 1155574,
		c: { populationDensity: 0.6, poverty: 0.5, climateRisk: 0.45, distanceToHospital: 0.35, distanceToSchool: 0.35, noActiveProjects: 0.4 }
	},
	{
		id: 'nakuru',
		name: 'Nakuru',
		code: '032',
		centroid: [36.0667, -0.3031],
		population: 2162202,
		c: { populationDensity: 0.5, poverty: 0.4, climateRisk: 0.35, distanceToHospital: 0.4, distanceToSchool: 0.4, noActiveProjects: 0.5 }
	},
	{
		id: 'turkana',
		name: 'Turkana',
		code: '023',
		centroid: [35.5667, 3.1167],
		population: 926976,
		c: { populationDensity: 0.15, poverty: 0.92, climateRisk: 0.9, distanceToHospital: 0.95, distanceToSchool: 0.9, noActiveProjects: 0.6 }
	},
	{
		id: 'marsabit',
		name: 'Marsabit',
		code: '010',
		centroid: [37.9908, 2.3284],
		population: 459785,
		c: { populationDensity: 0.1, poverty: 0.88, climateRisk: 0.85, distanceToHospital: 0.9, distanceToSchool: 0.85, noActiveProjects: 0.75 }
	},
	{
		id: 'garissa',
		name: 'Garissa',
		code: '007',
		centroid: [39.6583, -0.4536],
		population: 841353,
		c: { populationDensity: 0.2, poverty: 0.8, climateRisk: 0.8, distanceToHospital: 0.8, distanceToSchool: 0.75, noActiveProjects: 0.55 }
	},
	{
		id: 'mandera',
		name: 'Mandera',
		code: '009',
		centroid: [40.9167, 3.9167],
		population: 867457,
		c: { populationDensity: 0.25, poverty: 0.9, climateRisk: 0.82, distanceToHospital: 0.88, distanceToSchool: 0.82, noActiveProjects: 0.7 }
	},
	{
		id: 'kakamega',
		name: 'Kakamega',
		code: '037',
		centroid: [34.7519, 0.2827],
		population: 1867579,
		c: { populationDensity: 0.7, poverty: 0.55, climateRisk: 0.4, distanceToHospital: 0.45, distanceToSchool: 0.4, noActiveProjects: 0.45 }
	},
	{
		id: 'kilifi',
		name: 'Kilifi',
		code: '003',
		centroid: [39.85, -3.6333],
		population: 1453787,
		c: { populationDensity: 0.4, poverty: 0.62, climateRisk: 0.65, distanceToHospital: 0.55, distanceToSchool: 0.5, noActiveProjects: 0.5 }
	},
	{
		id: 'wajir',
		name: 'Wajir',
		code: '008',
		centroid: [40.0573, 1.7471],
		population: 781263,
		c: { populationDensity: 0.18, poverty: 0.87, climateRisk: 0.83, distanceToHospital: 0.85, distanceToSchool: 0.8, noActiveProjects: 0.65 }
	},
	{
		id: 'machakos',
		name: 'Machakos',
		code: '016',
		centroid: [37.2667, -1.5167],
		population: 1421932,
		c: { populationDensity: 0.45, poverty: 0.48, climateRisk: 0.5, distanceToHospital: 0.4, distanceToSchool: 0.38, noActiveProjects: 0.4 }
	}
];

function boxAround([lng, lat]: [number, number], r: number): number[][] {
	// crude placeholder polygon — a slightly irregular box so the choropleth has shape
	return [
		[lng - r, lat - r * 0.8],
		[lng + r * 0.9, lat - r],
		[lng + r, lat + r * 0.85],
		[lng - r * 0.85, lat + r],
		[lng - r, lat - r * 0.8]
	];
}

export const COUNTIES: County[] = seeds.map((s) => {
	const needScore = computeNeedScore(s.c);
	const hospitals = Math.max(2, Math.round((1 - s.c.distanceToHospital) * 60));
	const schools = Math.max(5, Math.round((1 - s.c.distanceToSchool) * 220));
	const activeProjects = Math.round((1 - s.c.noActiveProjects) * 18);
	return {
		id: s.id,
		name: s.name,
		code: s.code,
		population: s.population,
		povertyRate: s.c.poverty,
		hospitals,
		schools,
		roadLengthKm: Math.round((1 - s.c.distanceToHospital) * 1800 + 200),
		activeProjects,
		totalFunding: Math.round((activeProjects + 1) * 1_750_000 * (0.6 + s.c.poverty)),
		needScore,
		components: s.c,
		centroid: s.centroid,
		boundary: boxAround(s.centroid, 0.9) as [number, number][]
	};
});

export const COUNTY_POLYGONS: number[][][] = seeds.map((s) => boxAround(s.centroid, 0.9));

const donors = ['World Bank', 'USAID', 'UNDP', 'UNICEF', 'EU', 'DfID', 'AfDB', 'JICA'];
const implementers = ['County Government', 'Red Cross', 'Oxfam', 'Mercy Corps', 'WaterAid', 'Local NGO'];
const sectors = ['health', 'education', 'water', 'infrastructure', 'agriculture', 'climate', 'energy'] as const;
const statuses = ['active', 'active', 'active', 'completed', 'planned', 'stalled'] as const;

function pick<T>(arr: readonly T[], i: number): T {
	return arr[i % arr.length];
}

export const PROJECTS: Project[] = COUNTIES.flatMap((county, ci) => {
	const n = Math.max(1, county.activeProjects);
	return Array.from({ length: n }, (_, i) => {
		const idx = ci * 7 + i;
		const sector = pick(sectors, idx + ci);
		const status = pick(statuses, idx);
		const budget = 250_000 + ((idx * 137_000) % 4_000_000);
		const startYear = 2020 + (idx % 5);
		return {
			id: `${county.id}-p${i + 1}`,
			title: `${county.name} ${pick(['Health Centre', 'Borehole Programme', 'School Rehab', 'Feeder Road', 'Solar Mini-grid', 'Irrigation Scheme', 'Flood Defence'], idx)}`,
			budget,
			donor: pick(donors, idx),
			implementer: pick(implementers, idx + 2),
			startDate: `${startYear}-0${(idx % 9) + 1}-15`,
			endDate: `${startYear + 2}-0${(idx % 9) + 1}-15`,
			beneficiaries: 2_000 + ((idx * 4100) % 60_000),
			status,
			sector,
			countyId: county.id,
			coordinates: [
				county.centroid[0] + (((idx % 7) - 3) * 0.12),
				county.centroid[1] + (((idx % 5) - 2) * 0.12)
			] as [number, number],
			sdgs: [pick([1, 3, 4, 6, 7, 13], idx), pick([2, 5, 8, 9, 11], idx + 1)],
			description: `${pick(sectors, idx)} intervention serving communities in ${county.name} county.`
		};
	});
});

export const FACILITIES: Facility[] = COUNTIES.flatMap((county, ci) => {
	const hospitals = Array.from({ length: Math.min(6, county.hospitals) }, (_, i) => ({
		id: `${county.id}-h${i + 1}`,
		name: `${county.name} ${pick(['District', 'Referral', 'Sub-county', 'Mission'], i)} Hospital`,
		type: 'hospital' as const,
		countyId: county.id,
		coordinates: [
			county.centroid[0] + (((ci + i) % 5) - 2) * 0.1,
			county.centroid[1] + (((ci + i) % 4) - 2) * 0.1
		] as [number, number]
	}));
	const schools = Array.from({ length: Math.min(8, Math.round(county.schools / 20)) }, (_, i) => ({
		id: `${county.id}-s${i + 1}`,
		name: `${county.name} ${pick(['Primary', 'Secondary', 'Mixed Day', 'Girls'], i)} School ${i + 1}`,
		type: 'school' as const,
		countyId: county.id,
		coordinates: [
			county.centroid[0] + (((ci + i) % 6) - 3) * 0.08,
			county.centroid[1] + (((ci + i) % 5) - 2) * 0.09
		] as [number, number]
	}));
	return [...hospitals, ...schools];
});
