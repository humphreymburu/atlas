import type { County, Project } from '$lib/types';
import { countiesToGeoJSON } from '$lib/services/resources';

function download(filename: string, content: string, mime: string) {
	const blob = new Blob([content], { type: mime });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}

export function exportCountiesCSV(counties: County[]) {
	const headers = [
		'id',
		'name',
		'population',
		'povertyRate',
		'hospitals',
		'schools',
		'activeProjects',
		'totalFunding',
		'needScore'
	];
	const rows = counties.map((c) =>
		[c.id, c.name, c.population, c.povertyRate, c.hospitals, c.schools, c.activeProjects, c.totalFunding, c.needScore].join(
			','
		)
	);
	download('atlasaid-counties.csv', [headers.join(','), ...rows].join('\n'), 'text/csv');
}

export function exportProjectsCSV(projects: Project[]) {
	const headers = ['id', 'title', 'sector', 'status', 'donor', 'budget', 'beneficiaries', 'countyId'];
	const rows = projects.map((p) =>
		[p.id, `"${p.title}"`, p.sector, p.status, p.donor, p.budget, p.beneficiaries, p.countyId].join(',')
	);
	download('atlasaid-projects.csv', [headers.join(','), ...rows].join('\n'), 'text/csv');
}

export function exportGeoJSON(counties: County[]) {
	download('atlasaid-counties.geojson', JSON.stringify(countiesToGeoJSON(counties)), 'application/geo+json');
}
