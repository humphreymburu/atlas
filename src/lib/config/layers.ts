export type LayerId =
	| 'need-score'
	| 'admin-boundaries'
	| 'projects'
	| 'hospitals'
	| 'schools'
	| 'roads'
	| 'population'
	| 'climate-flood'
	| 'climate-drought';

export type LayerGroup = 'analysis' | 'infrastructure' | 'context' | 'climate';

export interface LayerDef {
	id: LayerId;
	label: string;
	group: LayerGroup;
	/** swatch colour shown in the layer manager */
	swatch: string;
	defaultVisible: boolean;
	description: string;
}

export const LAYER_GROUPS: Record<LayerGroup, string> = {
	analysis: 'Analysis',
	infrastructure: 'Infrastructure',
	context: 'Context',
	climate: 'Climate'
};

export const LAYERS: LayerDef[] = [
	{
		id: 'need-score',
		label: 'Need Score',
		group: 'analysis',
		swatch: 'linear-gradient(90deg,#22C55E,#EAB308,#F97316,#EF4444)',
		defaultVisible: true,
		description: 'Composite index of unmet need by county.'
	},
	{
		id: 'admin-boundaries',
		label: 'Admin boundaries',
		group: 'context',
		swatch: '#5EEAD4',
		defaultVisible: true,
		description: 'County outlines.'
	},
	{
		id: 'projects',
		label: 'Aid projects',
		group: 'infrastructure',
		swatch: '#2DD4BF',
		defaultVisible: true,
		description: 'Development projects by location.'
	},
	{
		id: 'hospitals',
		label: 'Hospitals',
		group: 'infrastructure',
		swatch: '#60A5FA',
		defaultVisible: false,
		description: 'Health facilities.'
	},
	{
		id: 'schools',
		label: 'Schools',
		group: 'infrastructure',
		swatch: '#A78BFA',
		defaultVisible: false,
		description: 'Education facilities.'
	},
	{
		id: 'roads',
		label: 'Roads',
		group: 'infrastructure',
		swatch: '#94A3B8',
		defaultVisible: false,
		description: 'Major road network.'
	},
	{
		id: 'population',
		label: 'Population',
		group: 'context',
		swatch: '#F472B6',
		defaultVisible: false,
		description: 'Population density.'
	},
	{
		id: 'climate-flood',
		label: 'Flood risk',
		group: 'climate',
		swatch: '#38BDF8',
		defaultVisible: false,
		description: 'Modelled flood exposure.'
	},
	{
		id: 'climate-drought',
		label: 'Drought risk',
		group: 'climate',
		swatch: '#FBBF24',
		defaultVisible: false,
		description: 'Modelled drought exposure.'
	}
];
