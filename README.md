# AtlasAid — Frontend

Geospatial development-intelligence platform. This is the **SvelteKit frontend** for the AtlasAid PRD: an interactive map that layers administrative, infrastructure, demographic, and climate data, with search, filters, a statistics dashboard, project explorer, and the **Need Score** (a transparent composite index of unmet need).

It runs **end-to-end on built-in mock data**, so you can see the whole app without a backend.

## Quick start

```bash
npm install
cp .env.example .env      # optional — add a Mapbox token to render the basemap
npm run dev
```

Open http://localhost:5173.

### Environment

| Variable | Purpose |
|---|---|
| `PUBLIC_MAPBOX_TOKEN` | Mapbox GL access token. **Optional** — without it the app still runs; the map area shows a placeholder and every panel works on mock data. Get a free token at https://account.mapbox.com/access-tokens/ |
| `PUBLIC_API_BASE_URL` | Backend base URL. **Leave blank** to use the mock data service. Set it to switch every fetch to the live FastAPI backend. |

## What's implemented (PRD Phase 1 / MVP)

- **Interactive map** (Mapbox GL) with a Need Score choropleth, admin boundaries, project/hospital/school point layers, navigation + scale controls, and click-to-select.
- **Search** across counties, hospitals, schools, and projects — fuzzy matching, autocomplete, recent searches, fly-to on select.
- **Layer manager** — grouped toggles with per-layer opacity.
- **Filters** — sector, status, donor, and project-year range, applied live to the map and dashboard.
- **Statistics dashboard** — summary cards plus *funding by sector* and *projects by donor* charts (Chart.js).
- **Project & county explorer** — detail drawer with the full Need Score breakdown and component weights.
- **Report export** — counties/projects to CSV and boundaries to GeoJSON, client-side.
- **Responsive shell**, keyboard-focusable controls, reduced-motion support, dark cartographic theme.

## Architecture

```
src/
├── routes/
│   ├── +layout.svelte        # TanStack Query provider + global styles
│   ├── +layout.ts            # ssr = false (client-rendered SPA)
│   └── +page.svelte          # app shell: top bar, sidebar tabs, map, drawer
├── lib/
│   ├── components/
│   │   ├── map/              # MapCanvas, MapLegend, LayerPanel
│   │   ├── search/          # SearchBar
│   │   ├── filters/         # FilterPanel
│   │   ├── dashboard/       # StatisticsDashboard, BarChart, StatCard
│   │   ├── projects/        # ProjectDetail, NeedScoreBreakdown
│   │   └── ui/              # Icon, Panel, Spinner
│   ├── stores/              # layers, filters, selection, search (Svelte stores)
│   ├── services/
│   │   ├── resources.ts     # fetchers + GeoJSON builders + mock/live switch
│   │   ├── export.ts        # CSV / GeoJSON download
│   │   └── mock/data.ts     # Kenyan counties, facilities, projects (mock)
│   ├── config/
│   │   ├── layers.ts        # layer registry
│   │   └── needScore.ts     # bands, weights, computeNeedScore()
│   ├── schemas.ts           # Zod validation for API responses
│   ├── types.ts             # domain types
│   └── utils/format.ts      # number / currency / date formatting
```

## Connecting a real backend

The frontend expects these endpoints (PRD §10.2), returning JSON that matches `src/lib/schemas.ts`:

- `GET /counties` → `County[]`
- `GET /projects` → `Project[]`
- `GET /facilities` → `Facility[]`

Set `PUBLIC_API_BASE_URL` and responses are validated with Zod before use. County polygon geometry is currently placeholder boxes in the mock layer; wire real GADM / Natural Earth boundaries into `countiesToGeoJSON`.

## Stack

SvelteKit · TypeScript · TailwindCSS · Mapbox GL JS · TanStack Query · Chart.js · Zod

## Notes & honest limitations

- County boundaries are **crude placeholder polygons** — replace with real boundary data.
- The **Need Score weights are defaults and an explicit assumption**; per the PRD they must be calibrated with domain input before any operational use. The UI frames the score as decision-support, never an automated verdict.
- Travel-time isochrones, the AI assistant, time slider, and offline support are later PRD phases and not included here.
