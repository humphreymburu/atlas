import type { NeedScoreComponents } from '$lib/types';

/**
 * Need Score bands (PRD §8.3). The score is a 0–100 composite where higher = greater unmet need.
 * These thresholds and the weights below are DEFAULTS and an explicit assumption — per the PRD
 * they must be calibrated with domain input before any real decision-making use.
 */
export interface NeedBand {
	label: string;
	min: number;
	max: number;
	color: string;
	token: 'low' | 'mid' | 'high' | 'crit';
}

export const NEED_BANDS: NeedBand[] = [
	{ label: 'Low', min: 0, max: 25, color: '#22C55E', token: 'low' },
	{ label: 'Moderate', min: 25, max: 50, color: '#EAB308', token: 'mid' },
	{ label: 'High', min: 50, max: 75, color: '#F97316', token: 'high' },
	{ label: 'Critical', min: 75, max: 100, color: '#EF4444', token: 'crit' }
];

/** Default indicator weights — sum to 1. Configurable per PRD §8.4. */
export const DEFAULT_WEIGHTS: NeedScoreComponents = {
	populationDensity: 0.15,
	poverty: 0.25,
	climateRisk: 0.15,
	distanceToHospital: 0.2,
	distanceToSchool: 0.15,
	noActiveProjects: 0.1
};

export const COMPONENT_LABELS: Record<keyof NeedScoreComponents, string> = {
	populationDensity: 'Population density',
	poverty: 'Poverty rate',
	climateRisk: 'Climate risk',
	distanceToHospital: 'Distance to hospital',
	distanceToSchool: 'Distance to school',
	noActiveProjects: 'No active projects'
};

export function bandFor(score: number): NeedBand {
	return NEED_BANDS.find((b) => score >= b.min && score < b.max) ?? NEED_BANDS[NEED_BANDS.length - 1];
}

export function needColor(score: number): string {
	return bandFor(score).color;
}

/** Recompute a 0–100 score from components + weights (PRD §8.1). */
export function computeNeedScore(
	c: NeedScoreComponents,
	weights: NeedScoreComponents = DEFAULT_WEIGHTS
): number {
	const sum =
		c.populationDensity * weights.populationDensity +
		c.poverty * weights.poverty +
		c.climateRisk * weights.climateRisk +
		c.distanceToHospital * weights.distanceToHospital +
		c.distanceToSchool * weights.distanceToSchool +
		c.noActiveProjects * weights.noActiveProjects;
	return Math.round(sum * 100);
}
