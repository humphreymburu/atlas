import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				ink: {
					950: '#070C16',
					900: '#0B1220',
					850: '#0E1626',
					800: '#111A2B',
					700: '#172234',
					600: '#1E2A3D'
				},
				line: '#22324a',
				accent: {
					DEFAULT: '#2DD4BF',
					soft: '#5EEAD4',
					deep: '#0E7A6E'
				},
				need: {
					low: '#22C55E',
					mid: '#EAB308',
					high: '#F97316',
					crit: '#EF4444'
				},
				fg: {
					DEFAULT: '#E6EDF6',
					muted: '#8A99AD',
					faint: '#5A6B82'
				}
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
				mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace']
			},
			boxShadow: {
				panel: '0 8px 30px rgba(0,0,0,0.45)',
				rail: '2px 0 24px rgba(0,0,0,0.35)'
			}
		}
	},
	plugins: []
} satisfies Config;
