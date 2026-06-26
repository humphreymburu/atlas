<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		Chart,
		BarController,
		BarElement,
		CategoryScale,
		LinearScale,
		Tooltip
	} from 'chart.js';
	import type { TooltipContext } from 'chart.js';

	Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

	export let labels: string[] = [];
	export let data: number[] = [];
	export let color = '#2DD4BF';
	export let horizontal = false;
	export let valuePrefix = '';

	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	function build() {
		if (!canvas) return;
		chart?.destroy();
		chart = new Chart(canvas, {
			type: 'bar',
			data: {
				labels,
				datasets: [
					{
						data,
						backgroundColor: color,
						borderRadius: 3,
						barPercentage: 0.7,
						categoryPercentage: 0.8
					}
				]
			},
			options: {
				indexAxis: horizontal ? 'y' : 'x',
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { display: false },
					tooltip: {
						backgroundColor: '#111A2B',
						borderColor: '#1E2A3D',
						borderWidth: 1,
						titleColor: '#E6EDF6',
						bodyColor: '#8A99AD',
						callbacks: {
							label: (ctx: TooltipContext) =>
								`${valuePrefix}${(ctx.parsed[horizontal ? 'x' : 'y'] ?? 0).toLocaleString()}`
						}
					}
				},
				scales: {
					x: {
						grid: { color: '#172234', display: !horizontal },
						ticks: { color: '#5A6B82', font: { size: 10 } },
						border: { display: false }
					},
					y: {
						grid: { color: '#172234', display: horizontal },
						ticks: { color: '#8A99AD', font: { size: 10 } },
						border: { display: false }
					}
				}
			}
		});
	}

	onMount(build);
	$: if (chart) {
		chart.data.labels = labels;
		chart.data.datasets[0].data = data;
		chart.update();
	}
	onDestroy(() => chart?.destroy());
</script>

<div class="relative h-40">
	<canvas bind:this={canvas}></canvas>
</div>
