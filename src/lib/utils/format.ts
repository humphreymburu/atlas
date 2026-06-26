export function formatNumber(n: number): string {
	return new Intl.NumberFormat('en-US').format(Math.round(n));
}

export function formatCompact(n: number): string {
	return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

export function formatUSD(n: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		notation: 'compact',
		maximumFractionDigits: 1
	}).format(n);
}

export function formatPercent(fraction: number, digits = 0): string {
	return new Intl.NumberFormat('en-US', {
		style: 'percent',
		maximumFractionDigits: digits
	}).format(fraction);
}

export function formatDate(iso: string): string {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

export function titleCase(s: string): string {
	return s.charAt(0).toUpperCase() + s.slice(1);
}
