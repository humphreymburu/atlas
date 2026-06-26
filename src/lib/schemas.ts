import { z } from 'zod';

export const projectStatusSchema = z.enum(['planned', 'active', 'completed', 'stalled']);

export const sectorSchema = z.enum([
	'health',
	'education',
	'water',
	'infrastructure',
	'agriculture',
	'climate',
	'energy'
]);

export const needScoreComponentsSchema = z.object({
	populationDensity: z.number().min(0).max(1),
	poverty: z.number().min(0).max(1),
	climateRisk: z.number().min(0).max(1),
	distanceToHospital: z.number().min(0).max(1),
	distanceToSchool: z.number().min(0).max(1),
	noActiveProjects: z.number().min(0).max(1)
});

export const countySchema = z.object({
	id: z.string(),
	name: z.string(),
	code: z.string(),
	population: z.number().int().nonnegative(),
	povertyRate: z.number().min(0).max(1),
	hospitals: z.number().int().nonnegative(),
	schools: z.number().int().nonnegative(),
	roadLengthKm: z.number().nonnegative(),
	activeProjects: z.number().int().nonnegative(),
	totalFunding: z.number().nonnegative(),
	needScore: z.number().min(0).max(100),
	components: needScoreComponentsSchema,
	centroid: z.tuple([z.number(), z.number()]),
	boundary: z.array(z.tuple([z.number(), z.number()])).nullable().optional()
});

export const facilitySchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.enum(['hospital', 'school']),
	countyId: z.string(),
	coordinates: z.tuple([z.number(), z.number()])
});

export const projectSchema = z.object({
	id: z.string(),
	title: z.string(),
	budget: z.number().nonnegative(),
	donor: z.string(),
	implementer: z.string(),
	startDate: z.string(),
	endDate: z.string(),
	beneficiaries: z.number().int().nonnegative(),
	status: projectStatusSchema,
	sector: sectorSchema,
	countyId: z.string(),
	coordinates: z.tuple([z.number(), z.number()]),
	sdgs: z.array(z.number().int()),
	description: z.string()
});

export const countyListSchema = z.array(countySchema);
export const facilityListSchema = z.array(facilitySchema);
export const projectListSchema = z.array(projectSchema);

export type CountyDTO = z.infer<typeof countySchema>;
export type FacilityDTO = z.infer<typeof facilitySchema>;
export type ProjectDTO = z.infer<typeof projectSchema>;
