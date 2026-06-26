<script lang="ts">
	// Minimal inline icon set (stroke-based, currentColor).
	export let name:
		| 'layers'
		| 'filter'
		| 'search'
		| 'close'
		| 'download'
		| 'hospital'
		| 'school'
		| 'project'
		| 'chevron'
		| 'pin'
		| 'reset'
		| 'info'
		| 'chart';
	export let size = 18;

	const paths: Record<string, string> = {
		layers: 'M12 3 2 8l10 5 10-5-10-5Zm0 8L2 16l10 5 10-5M2 12l10 5 10-5',
		filter: 'M3 4h18l-7 9v6l-4 2v-8L3 4Z',
		search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.3-4.3',
		close: 'M6 6l12 12M18 6 6 18',
		download: 'M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2',
		hospital: 'M4 21V8l8-5 8 5v13M9 21v-6h6v6M12 11v4m-2-2h4',
		school: 'M3 9l9-5 9 5-9 5-9-5Zm4 3v5c0 1 2 3 5 3s5-2 5-3v-5',
		project: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z',
		chevron: 'M9 6l6 6-6 6',
		pin: 'M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
		reset: 'M3 12a9 9 0 1 0 3-6.7M3 4v4h4',
		info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-11v5m0-8h.01',
		chart: 'M4 20V4m0 16h16M8 16v-5m4 5V8m4 8v-3'
	};
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.7"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	<path d={paths[name]} />
</svg>
