declare module 'chart.js' {
	export interface TooltipContext {
		parsed: Record<string, number | undefined>;
	}

	export class Chart {
		static register(...items: unknown[]): void;
		data: {
			labels?: string[];
			datasets: Array<{ data: number[] }>;
		};
		constructor(canvas: HTMLCanvasElement, config: unknown);
		update(): void;
		destroy(): void;
	}

	export const BarController: unknown;
	export const BarElement: unknown;
	export const CategoryScale: unknown;
	export const LinearScale: unknown;
	export const Tooltip: unknown;
}

declare module '@tanstack/query-core' {
	export class QueryClient {
		constructor(config?: unknown);
	}
}
