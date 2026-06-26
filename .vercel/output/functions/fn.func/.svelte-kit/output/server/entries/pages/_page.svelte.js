import { b as get_store_value, c as create_ssr_component, d as add_attribute, e as escape, o as onDestroy, s as subscribe, f as each, v as validate_component } from "../../chunks/ssr.js";
import { p as public_env } from "../../chunks/shared-server.js";
import { r as readable, d as derived, w as writable } from "../../chunks/index.js";
import { z } from "zod";
import { noop, notifyManager, QueryObserver } from "@tanstack/query-core";
import { g as getIsRestoringContext, a as getQueryClientContext } from "../../chunks/context.js";
function useIsRestoring() {
  return getIsRestoringContext();
}
function useQueryClient(queryClient) {
  return getQueryClientContext();
}
function isSvelteStore(obj) {
  return "subscribe" in obj && typeof obj.subscribe === "function";
}
function createBaseQuery(options, Observer, queryClient) {
  const client = useQueryClient();
  const isRestoring = useIsRestoring();
  const optionsStore = isSvelteStore(options) ? options : readable(options);
  const defaultedOptionsStore = derived([optionsStore, isRestoring], ([$optionsStore, $isRestoring]) => {
    const defaultedOptions = client.defaultQueryOptions($optionsStore);
    defaultedOptions._optimisticResults = $isRestoring ? "isRestoring" : "optimistic";
    return defaultedOptions;
  });
  const observer = new Observer(client, get_store_value(defaultedOptionsStore));
  defaultedOptionsStore.subscribe(($defaultedOptions) => {
    observer.setOptions($defaultedOptions);
  });
  const result = derived(isRestoring, ($isRestoring, set) => {
    const unsubscribe = $isRestoring ? noop : observer.subscribe(notifyManager.batchCalls(set));
    observer.updateResult();
    return unsubscribe;
  });
  const { subscribe: subscribe2 } = derived([result, defaultedOptionsStore], ([$result, $defaultedOptionsStore]) => {
    $result = observer.getOptimisticResult($defaultedOptionsStore);
    return !$defaultedOptionsStore.notifyOnChangeProps ? observer.trackResult($result) : $result;
  });
  return { subscribe: subscribe2 };
}
function createQuery(options, queryClient) {
  return createBaseQuery(options, QueryObserver);
}
const Icon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { size = 18 } = $$props;
  const paths = {
    layers: "M12 3 2 8l10 5 10-5-10-5Zm0 8L2 16l10 5 10-5M2 12l10 5 10-5",
    filter: "M3 4h18l-7 9v6l-4 2v-8L3 4Z",
    search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.3-4.3",
    close: "M6 6l12 12M18 6 6 18",
    download: "M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",
    hospital: "M4 21V8l8-5 8 5v13M9 21v-6h6v6M12 11v4m-2-2h4",
    school: "M3 9l9-5 9 5-9 5-9-5Zm4 3v5c0 1 2 3 5 3s5-2 5-3v-5",
    project: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z",
    chevron: "M9 6l6 6-6 6",
    pin: "M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
    reset: "M3 12a9 9 0 1 0 3-6.7M3 4v4h4",
    info: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-11v5m0-8h.01",
    chart: "M4 20V4m0 16h16M8 16v-5m4 5V8m4 8v-3"
  };
  if ($$props.name === void 0 && $$bindings.name && name !== void 0) $$bindings.name(name);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
  return `<svg${add_attribute("width", size, 0)}${add_attribute("height", size, 0)} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path${add_attribute("d", paths[name], 0)}></path></svg>`;
});
const Spinner = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = 18 } = $$props;
  let { label = "Loading" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0) $$bindings.label(label);
  return `<span class="inline-flex items-center gap-2 text-fg-muted text-xs" role="status"><svg${add_attribute("width", size, 0)}${add_attribute("height", size, 0)} viewBox="0 0 24 24" class="animate-spin" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-opacity="0.2" stroke-width="3"></circle><path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path></svg> <span class="sr-only">${escape(label)}</span></span>`;
});
const LAYER_GROUPS = {
  analysis: "Analysis",
  infrastructure: "Infrastructure",
  context: "Context",
  climate: "Climate"
};
const LAYERS = [
  {
    id: "need-score",
    label: "Need Score",
    group: "analysis",
    swatch: "linear-gradient(90deg,#22C55E,#EAB308,#F97316,#EF4444)",
    defaultVisible: true,
    description: "Composite index of unmet need by county."
  },
  {
    id: "admin-boundaries",
    label: "Admin boundaries",
    group: "context",
    swatch: "#5EEAD4",
    defaultVisible: true,
    description: "County outlines."
  },
  {
    id: "projects",
    label: "Aid projects",
    group: "infrastructure",
    swatch: "#2DD4BF",
    defaultVisible: true,
    description: "Development projects by location."
  },
  {
    id: "hospitals",
    label: "Hospitals",
    group: "infrastructure",
    swatch: "#60A5FA",
    defaultVisible: false,
    description: "Health facilities."
  },
  {
    id: "schools",
    label: "Schools",
    group: "infrastructure",
    swatch: "#A78BFA",
    defaultVisible: false,
    description: "Education facilities."
  },
  {
    id: "roads",
    label: "Roads",
    group: "infrastructure",
    swatch: "#94A3B8",
    defaultVisible: false,
    description: "Major road network."
  },
  {
    id: "population",
    label: "Population",
    group: "context",
    swatch: "#F472B6",
    defaultVisible: false,
    description: "Population density."
  },
  {
    id: "climate-flood",
    label: "Flood risk",
    group: "climate",
    swatch: "#38BDF8",
    defaultVisible: false,
    description: "Modelled flood exposure."
  },
  {
    id: "climate-drought",
    label: "Drought risk",
    group: "climate",
    swatch: "#FBBF24",
    defaultVisible: false,
    description: "Modelled drought exposure."
  }
];
function initial() {
  const state = {};
  for (const l of LAYERS) state[l.id] = { visible: l.defaultVisible, opacity: 1 };
  return state;
}
function createLayerStore() {
  const { subscribe: subscribe2, update } = writable(initial());
  return {
    subscribe: subscribe2,
    toggle: (id) => update((s) => ({ ...s, [id]: { ...s[id], visible: !s[id].visible } })),
    setOpacity: (id, opacity) => update((s) => ({ ...s, [id]: { ...s[id], opacity } })),
    show: (id) => update((s) => ({ ...s, [id]: { ...s[id], visible: true } }))
  };
}
const layers = createLayerStore();
const selection = writable(null);
const NEED_BANDS = [
  { label: "Low", min: 0, max: 25, color: "#22C55E", token: "low" },
  { label: "Moderate", min: 25, max: 50, color: "#EAB308", token: "mid" },
  { label: "High", min: 50, max: 75, color: "#F97316", token: "high" },
  { label: "Critical", min: 75, max: 100, color: "#EF4444", token: "crit" }
];
const DEFAULT_WEIGHTS = {
  populationDensity: 0.15,
  poverty: 0.25,
  climateRisk: 0.15,
  distanceToHospital: 0.2,
  distanceToSchool: 0.15,
  noActiveProjects: 0.1
};
const COMPONENT_LABELS = {
  populationDensity: "Population density",
  poverty: "Poverty rate",
  climateRisk: "Climate risk",
  distanceToHospital: "Distance to hospital",
  distanceToSchool: "Distance to school",
  noActiveProjects: "No active projects"
};
function bandFor(score2) {
  return NEED_BANDS.find((b) => score2 >= b.min && score2 < b.max) ?? NEED_BANDS[NEED_BANDS.length - 1];
}
function computeNeedScore(c, weights = DEFAULT_WEIGHTS) {
  const sum = c.populationDensity * weights.populationDensity + c.poverty * weights.poverty + c.climateRisk * weights.climateRisk + c.distanceToHospital * weights.distanceToHospital + c.distanceToSchool * weights.distanceToSchool + c.noActiveProjects * weights.noActiveProjects;
  return Math.round(sum * 100);
}
const MapCanvas = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { countiesGeo } = $$props;
  let { projectsGeo } = $$props;
  let { facilitiesGeo } = $$props;
  const TOKEN = public_env.PUBLIC_MAPBOX_TOKEN?.trim() ?? "";
  const hasToken = TOKEN.length > 0;
  let container;
  let map = null;
  let unsubs = [];
  [
    "step",
    ["get", "needScore"],
    NEED_BANDS[0].color,
    NEED_BANDS[1].min,
    NEED_BANDS[1].color,
    NEED_BANDS[2].min,
    NEED_BANDS[2].color,
    NEED_BANDS[3].min,
    NEED_BANDS[3].color
  ];
  onDestroy(() => {
    unsubs.forEach((u) => u());
    map?.remove();
    map = null;
  });
  if ($$props.countiesGeo === void 0 && $$bindings.countiesGeo && countiesGeo !== void 0) $$bindings.countiesGeo(countiesGeo);
  if ($$props.projectsGeo === void 0 && $$bindings.projectsGeo && projectsGeo !== void 0) $$bindings.projectsGeo(projectsGeo);
  if ($$props.facilitiesGeo === void 0 && $$bindings.facilitiesGeo && facilitiesGeo !== void 0) $$bindings.facilitiesGeo(facilitiesGeo);
  if ($$props.hasToken === void 0 && $$bindings.hasToken && hasToken !== void 0) $$bindings.hasToken(hasToken);
  return `<div class="absolute inset-0 h-full w-full" aria-label="Interactive map"${add_attribute("this", container, 0)}></div> ${!hasToken ? `<div class="absolute inset-0 grid place-items-center bg-ink-950 px-6 text-center" data-svelte-h="svelte-xogcbs"><div class="max-w-md"><div class="mx-auto mb-4 h-12 w-12 rounded-xl border border-ink-600 grid place-items-center text-accent"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11Z" stroke-linejoin="round"></path><circle cx="12" cy="10" r="2.4"></circle></svg></div> <p class="eyebrow mb-2">Map basemap unavailable</p> <p class="text-sm text-fg-muted leading-relaxed">Add a Mapbox token to <code class="text-accent">.env</code> as
				<code class="text-accent">PUBLIC_MAPBOX_TOKEN</code> to render the map.
				Every other panel is live on mock data in the meantime.</p></div></div>` : `${``}`}`;
});
const MapLegend = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let visible;
  let $layers, $$unsubscribe_layers;
  $$unsubscribe_layers = subscribe(layers, (value) => $layers = value);
  visible = $layers["need-score"]?.visible;
  $$unsubscribe_layers();
  return `${visible ? `<div class="panel px-3 py-2.5 pointer-events-auto"><p class="eyebrow mb-2" data-svelte-h="svelte-194y4y2">Need Score</p> <div class="flex items-center gap-0.5">${each(NEED_BANDS, (band) => {
    return `<div class="flex flex-col items-center gap-1" style="width:46px"><span class="h-2 w-full rounded-sm" style="${"background:" + escape(band.color, true)}"></span> <span class="text-[10px] text-fg-muted">${escape(band.label)}</span> </div>`;
  })}</div> <div class="mt-1.5 flex justify-between tnum text-[10px] text-fg-faint" data-svelte-h="svelte-hy89ca"><span>0</span><span>50</span><span>100</span></div></div>` : ``}`;
});
const LayerPanel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $layers, $$unsubscribe_layers;
  $$unsubscribe_layers = subscribe(layers, (value) => $layers = value);
  const groups = Object.keys(LAYER_GROUPS);
  function inGroup(g) {
    return LAYERS.filter((l) => l.group === g);
  }
  $$unsubscribe_layers();
  return `<div class="space-y-4">${each(groups, (group) => {
    return `<div><p class="eyebrow mb-2">${escape(LAYER_GROUPS[group])}</p> <ul class="space-y-1.5">${each(inGroup(group), (layer) => {
      let state = $layers[layer.id];
      return ` <li class="rounded-lg px-2 py-1.5 hover:bg-ink-800/60 transition-colors"><div class="flex items-center gap-2.5"><button role="switch"${add_attribute("aria-checked", state.visible, 0)}${add_attribute("aria-label", `Toggle ${layer.label}`, 0)} class="${"relative h-4 w-7 shrink-0 rounded-full transition-colors " + escape(state.visible ? "bg-accent" : "bg-ink-600", true)}"><span class="absolute top-0.5 h-3 w-3 rounded-full bg-ink-950 transition-all" style="${"left:" + escape(state.visible ? "14px" : "2px", true)}"></span></button> <span class="h-3 w-3 shrink-0 rounded-sm border border-ink-600" style="${"background:" + escape(layer.swatch, true)}"></span> <span class="${"flex-1 text-sm " + escape(state.visible ? "text-fg" : "text-fg-muted", true)}">${escape(layer.label)}</span></div> ${state.visible ? `<div class="mt-1.5 flex items-center gap-2 pl-[38px]"><input type="range" min="0.2" max="1" step="0.1"${add_attribute("value", state.opacity, 0)}${add_attribute("aria-label", `${layer.label} opacity`, 0)} class="h-1 flex-1 cursor-pointer accent-accent"> <span class="tnum w-8 text-right text-[10px] text-fg-faint">${escape(Math.round(state.opacity * 100))}%</span> </div>` : ``} </li>`;
    })}</ul> </div>`;
  })}</div>`;
});
const DEFAULT_FILTERS = {
  sectors: /* @__PURE__ */ new Set(),
  statuses: /* @__PURE__ */ new Set(),
  donors: /* @__PURE__ */ new Set(),
  minNeedScore: 0,
  yearFrom: 2018,
  yearTo: 2027
};
function createFilters() {
  const { subscribe: subscribe2, update, set } = writable({ ...DEFAULT_FILTERS });
  function toggleIn(setRef, value) {
    const next = new Set(setRef);
    next.has(value) ? next.delete(value) : next.add(value);
    return next;
  }
  return {
    subscribe: subscribe2,
    toggleSector: (s) => update((f) => ({ ...f, sectors: toggleIn(f.sectors, s) })),
    toggleStatus: (s) => update((f) => ({ ...f, statuses: toggleIn(f.statuses, s) })),
    toggleDonor: (d) => update((f) => ({ ...f, donors: toggleIn(f.donors, d) })),
    setMinNeedScore: (n) => update((f) => ({ ...f, minNeedScore: n })),
    setYears: (from, to) => update((f) => ({ ...f, yearFrom: from, yearTo: to })),
    reset: () => set({ ...DEFAULT_FILTERS, sectors: /* @__PURE__ */ new Set(), statuses: /* @__PURE__ */ new Set(), donors: /* @__PURE__ */ new Set() })
  };
}
const filters = createFilters();
function applyProjectFilters(projects, f, counties = []) {
  const needByCounty = new Map(counties.map((c) => [c.id, c.needScore]));
  return projects.filter((p) => {
    if (f.sectors.size && !f.sectors.has(p.sector)) return false;
    if (f.statuses.size && !f.statuses.has(p.status)) return false;
    if (f.donors.size && !f.donors.has(p.donor)) return false;
    if (f.minNeedScore > 0 && (needByCounty.get(p.countyId) ?? 0) < f.minNeedScore) return false;
    const year = new Date(p.startDate).getFullYear();
    if (year < f.yearFrom || year > f.yearTo) return false;
    return true;
  });
}
const activeFilterCount = derived(filters, (f) => {
  let n = f.sectors.size + f.statuses.size + f.donors.size;
  if (f.minNeedScore > 0) n += 1;
  if (f.yearFrom !== DEFAULT_FILTERS.yearFrom || f.yearTo !== DEFAULT_FILTERS.yearTo) n += 1;
  return n;
});
function formatNumber(n) {
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}
function formatUSD(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1
  }).format(n);
}
function formatPercent(fraction, digits = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: digits
  }).format(fraction);
}
function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}
function titleCase(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
const MAX_RECENT = 5;
function createRecent() {
  const { subscribe: subscribe2, update } = writable([]);
  return {
    subscribe: subscribe2,
    add: (term) => update((list) => {
      const trimmed = term.trim();
      if (!trimmed) return list;
      return [trimmed, ...list.filter((t) => t !== trimmed)].slice(0, MAX_RECENT);
    })
  };
}
const recentSearches = createRecent();
function score(label, q) {
  const l = label.toLowerCase();
  const needle = q.toLowerCase();
  if (l.includes(needle)) return 100 - l.indexOf(needle);
  let qi = 0;
  for (let i = 0; i < l.length && qi < needle.length; i++) if (l[i] === needle[qi]) qi++;
  return qi === needle.length ? 40 - (l.length - needle.length) : -1;
}
const SearchBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_recentSearches;
  $$unsubscribe_recentSearches = subscribe(recentSearches, (value) => value);
  let { index = [] } = $$props;
  let query = "";
  let inputEl;
  if ($$props.index === void 0 && $$bindings.index && index !== void 0) $$bindings.index(index);
  query.trim().length === 0 ? [] : index.map((r) => ({ r, s: score(r.label, query.trim()) })).filter((x) => x.s >= 0).sort((a, b) => b.s - a.s).slice(0, 8).map((x) => x.r);
  $$unsubscribe_recentSearches();
  return `<div class="relative w-full"><div class="${"panel flex items-center gap-2 px-3 py-2 " + escape(
    "",
    true
  )}"><span class="text-fg-faint">${validate_component(Icon, "Icon").$$render($$result, { name: "search", size: 16 }, {}, {})}</span> <input placeholder="Search counties, hospitals, schools, projects…" class="w-full bg-transparent text-sm text-fg placeholder:text-fg-faint focus:outline-none" aria-label="Search" autocomplete="off"${add_attribute("this", inputEl, 0)}${add_attribute("value", query, 0)}> ${``}</div> ${``}</div>`;
});
const NeedScoreBreakdown = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let band;
  let rows;
  let { components } = $$props;
  let { score: score2 } = $$props;
  if ($$props.components === void 0 && $$bindings.components && components !== void 0) $$bindings.components(components);
  if ($$props.score === void 0 && $$bindings.score && score2 !== void 0) $$bindings.score(score2);
  band = bandFor(score2);
  rows = Object.keys(components).map((k) => ({
    key: k,
    label: COMPONENT_LABELS[k],
    value: components[k],
    weight: DEFAULT_WEIGHTS[k]
  }));
  return `<div><div class="flex items-baseline gap-2"><span class="tnum text-3xl font-semibold" style="${"color:" + escape(band.color, true)}">${escape(score2)}</span> <span class="text-sm text-fg-muted" data-svelte-h="svelte-48i9uu">/ 100</span> <span class="ml-auto rounded-full px-2 py-0.5 text-[11px] font-medium" style="${"background:" + escape(band.color, true) + "22;color:" + escape(band.color, true)}">${escape(band.label)}</span></div> <div class="mt-3 space-y-2">${each(rows, (r) => {
    return `<div><div class="mb-1 flex items-center justify-between text-[11px]"><span class="text-fg-muted">${escape(r.label)}</span> <span class="tnum text-fg-faint">${escape(formatPercent(r.value))} · w${escape(r.weight)}</span></div> <div class="h-1.5 overflow-hidden rounded-full bg-ink-700"><div class="h-full rounded-full bg-accent/70" style="${"width:" + escape(r.value * 100, true) + "%"}"></div></div> </div>`;
  })}</div> <p class="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-fg-faint" data-svelte-h="svelte-1tt4vrl"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" class="mt-px shrink-0"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5m0-8h.01" stroke-linecap="round"></path></svg>
		Decision-support only. Default weights are an assumption pending calibration — adjust before
		operational use.</p></div>`;
});
const ProjectDetail = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let county;
  let project;
  let countyProjects;
  let $selection, $$unsubscribe_selection;
  $$unsubscribe_selection = subscribe(selection, (value) => $selection = value);
  let { counties = [] } = $$props;
  let { projects = [] } = $$props;
  const STATUS_COLOR = {
    active: "#22C55E",
    planned: "#EAB308",
    completed: "#60A5FA",
    stalled: "#EF4444"
  };
  if ($$props.counties === void 0 && $$bindings.counties && counties !== void 0) $$bindings.counties(counties);
  if ($$props.projects === void 0 && $$bindings.projects && projects !== void 0) $$bindings.projects(projects);
  county = $selection?.kind === "county" ? counties.find((c) => c.id === $selection.id) ?? null : null;
  project = $selection?.kind === "project" ? projects.find((p) => p.id === $selection.id) ?? null : null;
  countyProjects = county ? projects.filter((p) => p.countyId === county.id) : [];
  $$unsubscribe_selection();
  return `${county || project ? `<aside class="panel pointer-events-auto flex max-h-full w-[340px] flex-col overflow-hidden" aria-label="Detail"><header class="flex items-start justify-between gap-2 border-b border-ink-600 px-4 py-3"><div><p class="eyebrow">${escape(county ? "County" : "Project")}</p> <h2 class="mt-0.5 text-base font-semibold text-fg leading-tight">${escape(county ? county.name : project?.title)}</h2></div> <button class="btn-ghost !p-1.5" aria-label="Close detail">${validate_component(Icon, "Icon").$$render($$result, { name: "close", size: 18 }, {}, {})}</button></header> <div class="flex-1 overflow-auto px-4 py-4">${county ? `${validate_component(NeedScoreBreakdown, "NeedScoreBreakdown").$$render(
    $$result,
    {
      components: county.components,
      score: county.needScore
    },
    {},
    {}
  )} <div class="mt-5 grid grid-cols-2 gap-2 text-sm"><div class="rounded-lg bg-ink-800/60 px-3 py-2"><p class="eyebrow" data-svelte-h="svelte-fyfqu1">Population</p> <p class="tnum mt-0.5 text-fg">${escape(formatNumber(county.population))}</p></div> <div class="rounded-lg bg-ink-800/60 px-3 py-2"><p class="eyebrow" data-svelte-h="svelte-t05v2t">Poverty</p> <p class="tnum mt-0.5 text-fg">${escape(formatPercent(county.povertyRate))}</p></div> <div class="rounded-lg bg-ink-800/60 px-3 py-2"><p class="eyebrow" data-svelte-h="svelte-18u8qcr">Hospitals</p> <p class="tnum mt-0.5 text-fg">${escape(county.hospitals)}</p></div> <div class="rounded-lg bg-ink-800/60 px-3 py-2"><p class="eyebrow" data-svelte-h="svelte-1v7vbkd">Schools</p> <p class="tnum mt-0.5 text-fg">${escape(county.schools)}</p></div> <div class="rounded-lg bg-ink-800/60 px-3 py-2"><p class="eyebrow" data-svelte-h="svelte-1pfuolc">Active projects</p> <p class="tnum mt-0.5 text-fg">${escape(county.activeProjects)}</p></div> <div class="rounded-lg bg-ink-800/60 px-3 py-2"><p class="eyebrow" data-svelte-h="svelte-p4o2id">Funding</p> <p class="tnum mt-0.5 text-fg">${escape(formatUSD(county.totalFunding))}</p></div></div> <div class="mt-5"><p class="eyebrow mb-2">Projects here (${escape(countyProjects.length)})</p> <ul class="space-y-1">${each(countyProjects.slice(0, 6), (p) => {
    return `<li><button class="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-fg-muted hover:bg-ink-800 hover:text-fg"><span class="h-2 w-2 shrink-0 rounded-full" style="${"background:" + escape(STATUS_COLOR[p.status], true)}"></span> <span class="flex-1 truncate">${escape(p.title)}</span> ${validate_component(Icon, "Icon").$$render($$result, { name: "chevron", size: 14 }, {}, {})}</button> </li>`;
  })}</ul></div>` : `${project ? `<div class="flex items-center gap-2"><span class="rounded-full px-2 py-0.5 text-[11px] font-medium" style="${"background:" + escape(STATUS_COLOR[project.status], true) + "22;color:" + escape(STATUS_COLOR[project.status], true)}">${escape(titleCase(project.status))}</span> <span class="chip">${escape(titleCase(project.sector))}</span></div> <p class="mt-3 text-sm leading-relaxed text-fg-muted">${escape(project.description)}</p> <dl class="mt-4 space-y-2.5 text-sm">${each(
    [
      ["Budget", formatUSD(project.budget)],
      ["Donor", project.donor],
      ["Implementer", project.implementer],
      ["Beneficiaries", formatNumber(project.beneficiaries)],
      [
        "Timeline",
        `${formatDate(project.startDate)} – ${formatDate(project.endDate)}`
      ]
    ],
    ([k, v]) => {
      return `<div class="flex justify-between gap-3 border-b border-ink-700/60 pb-2"><dt class="text-fg-faint">${escape(k)}</dt> <dd class="tnum text-right text-fg">${escape(v)}</dd> </div>`;
    }
  )}</dl> <div class="mt-4"><p class="eyebrow mb-2" data-svelte-h="svelte-1bl5hh9">SDGs</p> <div class="flex flex-wrap gap-1.5">${each(project.sdgs, (g) => {
    return `<span class="chip tnum !text-accent !border-accent/40">SDG ${escape(g)}</span>`;
  })}</div></div> <button class="btn-outline mt-5 w-full">${validate_component(Icon, "Icon").$$render($$result, { name: "pin", size: 16 }, {}, {})} Centre on map</button>` : ``}`}</div></aside>` : ``}`;
});
const seeds = [
  {
    id: "nairobi",
    name: "Nairobi",
    code: "047",
    centroid: [36.8219, -1.2921],
    population: 4397073,
    c: { populationDensity: 0.95, poverty: 0.3, climateRisk: 0.2, distanceToHospital: 0.1, distanceToSchool: 0.1, noActiveProjects: 0.1 }
  },
  {
    id: "mombasa",
    name: "Mombasa",
    code: "001",
    centroid: [39.6682, -4.0435],
    population: 1208333,
    c: { populationDensity: 0.8, poverty: 0.45, climateRisk: 0.6, distanceToHospital: 0.25, distanceToSchool: 0.3, noActiveProjects: 0.3 }
  },
  {
    id: "kisumu",
    name: "Kisumu",
    code: "042",
    centroid: [34.7617, -0.0917],
    population: 1155574,
    c: { populationDensity: 0.6, poverty: 0.5, climateRisk: 0.45, distanceToHospital: 0.35, distanceToSchool: 0.35, noActiveProjects: 0.4 }
  },
  {
    id: "nakuru",
    name: "Nakuru",
    code: "032",
    centroid: [36.0667, -0.3031],
    population: 2162202,
    c: { populationDensity: 0.5, poverty: 0.4, climateRisk: 0.35, distanceToHospital: 0.4, distanceToSchool: 0.4, noActiveProjects: 0.5 }
  },
  {
    id: "turkana",
    name: "Turkana",
    code: "023",
    centroid: [35.5667, 3.1167],
    population: 926976,
    c: { populationDensity: 0.15, poverty: 0.92, climateRisk: 0.9, distanceToHospital: 0.95, distanceToSchool: 0.9, noActiveProjects: 0.6 }
  },
  {
    id: "marsabit",
    name: "Marsabit",
    code: "010",
    centroid: [37.9908, 2.3284],
    population: 459785,
    c: { populationDensity: 0.1, poverty: 0.88, climateRisk: 0.85, distanceToHospital: 0.9, distanceToSchool: 0.85, noActiveProjects: 0.75 }
  },
  {
    id: "garissa",
    name: "Garissa",
    code: "007",
    centroid: [39.6583, -0.4536],
    population: 841353,
    c: { populationDensity: 0.2, poverty: 0.8, climateRisk: 0.8, distanceToHospital: 0.8, distanceToSchool: 0.75, noActiveProjects: 0.55 }
  },
  {
    id: "mandera",
    name: "Mandera",
    code: "009",
    centroid: [40.9167, 3.9167],
    population: 867457,
    c: { populationDensity: 0.25, poverty: 0.9, climateRisk: 0.82, distanceToHospital: 0.88, distanceToSchool: 0.82, noActiveProjects: 0.7 }
  },
  {
    id: "kakamega",
    name: "Kakamega",
    code: "037",
    centroid: [34.7519, 0.2827],
    population: 1867579,
    c: { populationDensity: 0.7, poverty: 0.55, climateRisk: 0.4, distanceToHospital: 0.45, distanceToSchool: 0.4, noActiveProjects: 0.45 }
  },
  {
    id: "kilifi",
    name: "Kilifi",
    code: "003",
    centroid: [39.85, -3.6333],
    population: 1453787,
    c: { populationDensity: 0.4, poverty: 0.62, climateRisk: 0.65, distanceToHospital: 0.55, distanceToSchool: 0.5, noActiveProjects: 0.5 }
  },
  {
    id: "wajir",
    name: "Wajir",
    code: "008",
    centroid: [40.0573, 1.7471],
    population: 781263,
    c: { populationDensity: 0.18, poverty: 0.87, climateRisk: 0.83, distanceToHospital: 0.85, distanceToSchool: 0.8, noActiveProjects: 0.65 }
  },
  {
    id: "machakos",
    name: "Machakos",
    code: "016",
    centroid: [37.2667, -1.5167],
    population: 1421932,
    c: { populationDensity: 0.45, poverty: 0.48, climateRisk: 0.5, distanceToHospital: 0.4, distanceToSchool: 0.38, noActiveProjects: 0.4 }
  }
];
function boxAround([lng, lat], r) {
  return [
    [lng - r, lat - r * 0.8],
    [lng + r * 0.9, lat - r],
    [lng + r, lat + r * 0.85],
    [lng - r * 0.85, lat + r],
    [lng - r, lat - r * 0.8]
  ];
}
const COUNTIES = seeds.map((s) => {
  const needScore = computeNeedScore(s.c);
  const hospitals = Math.max(2, Math.round((1 - s.c.distanceToHospital) * 60));
  const schools = Math.max(5, Math.round((1 - s.c.distanceToSchool) * 220));
  const activeProjects = Math.round((1 - s.c.noActiveProjects) * 18);
  return {
    id: s.id,
    name: s.name,
    code: s.code,
    population: s.population,
    povertyRate: s.c.poverty,
    hospitals,
    schools,
    roadLengthKm: Math.round((1 - s.c.distanceToHospital) * 1800 + 200),
    activeProjects,
    totalFunding: Math.round((activeProjects + 1) * 175e4 * (0.6 + s.c.poverty)),
    needScore,
    components: s.c,
    centroid: s.centroid,
    boundary: boxAround(s.centroid, 0.9)
  };
});
const COUNTY_POLYGONS = seeds.map((s) => boxAround(s.centroid, 0.9));
const donors = ["World Bank", "USAID", "UNDP", "UNICEF", "EU", "DfID", "AfDB", "JICA"];
const implementers = ["County Government", "Red Cross", "Oxfam", "Mercy Corps", "WaterAid", "Local NGO"];
const sectors = ["health", "education", "water", "infrastructure", "agriculture", "climate", "energy"];
const statuses = ["active", "active", "active", "completed", "planned", "stalled"];
function pick(arr, i) {
  return arr[i % arr.length];
}
const PROJECTS = COUNTIES.flatMap((county, ci) => {
  const n = Math.max(1, county.activeProjects);
  return Array.from({ length: n }, (_, i) => {
    const idx = ci * 7 + i;
    const sector = pick(sectors, idx + ci);
    const status = pick(statuses, idx);
    const budget = 25e4 + idx * 137e3 % 4e6;
    const startYear = 2020 + idx % 5;
    return {
      id: `${county.id}-p${i + 1}`,
      title: `${county.name} ${pick(["Health Centre", "Borehole Programme", "School Rehab", "Feeder Road", "Solar Mini-grid", "Irrigation Scheme", "Flood Defence"], idx)}`,
      budget,
      donor: pick(donors, idx),
      implementer: pick(implementers, idx + 2),
      startDate: `${startYear}-0${idx % 9 + 1}-15`,
      endDate: `${startYear + 2}-0${idx % 9 + 1}-15`,
      beneficiaries: 2e3 + idx * 4100 % 6e4,
      status,
      sector,
      countyId: county.id,
      coordinates: [
        county.centroid[0] + (idx % 7 - 3) * 0.12,
        county.centroid[1] + (idx % 5 - 2) * 0.12
      ],
      sdgs: [pick([1, 3, 4, 6, 7, 13], idx), pick([2, 5, 8, 9, 11], idx + 1)],
      description: `${pick(sectors, idx)} intervention serving communities in ${county.name} county.`
    };
  });
});
const FACILITIES = COUNTIES.flatMap((county, ci) => {
  const hospitals = Array.from({ length: Math.min(6, county.hospitals) }, (_, i) => ({
    id: `${county.id}-h${i + 1}`,
    name: `${county.name} ${pick(["District", "Referral", "Sub-county", "Mission"], i)} Hospital`,
    type: "hospital",
    countyId: county.id,
    coordinates: [
      county.centroid[0] + ((ci + i) % 5 - 2) * 0.1,
      county.centroid[1] + ((ci + i) % 4 - 2) * 0.1
    ]
  }));
  const schools = Array.from({ length: Math.min(8, Math.round(county.schools / 20)) }, (_, i) => ({
    id: `${county.id}-s${i + 1}`,
    name: `${county.name} ${pick(["Primary", "Secondary", "Mixed Day", "Girls"], i)} School ${i + 1}`,
    type: "school",
    countyId: county.id,
    coordinates: [
      county.centroid[0] + ((ci + i) % 6 - 3) * 0.08,
      county.centroid[1] + ((ci + i) % 5 - 2) * 0.09
    ]
  }));
  return [...hospitals, ...schools];
});
const projectStatusSchema = z.enum(["planned", "active", "completed", "stalled"]);
const sectorSchema = z.enum([
  "health",
  "education",
  "water",
  "infrastructure",
  "agriculture",
  "climate",
  "energy"
]);
const needScoreComponentsSchema = z.object({
  populationDensity: z.number().min(0).max(1),
  poverty: z.number().min(0).max(1),
  climateRisk: z.number().min(0).max(1),
  distanceToHospital: z.number().min(0).max(1),
  distanceToSchool: z.number().min(0).max(1),
  noActiveProjects: z.number().min(0).max(1)
});
const countySchema = z.object({
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
const facilitySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["hospital", "school"]),
  countyId: z.string(),
  coordinates: z.tuple([z.number(), z.number()])
});
const projectSchema = z.object({
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
const countyListSchema = z.array(countySchema);
const facilityListSchema = z.array(facilitySchema);
const projectListSchema = z.array(projectSchema);
const API_BASE = public_env.PUBLIC_API_BASE_URL?.trim() ?? "";
const USE_MOCK = API_BASE.length === 0;
function delay(value, ms = 280) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
async function get(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" }
  });
  if (!res.ok) {
    throw new Error(`Request to ${path} failed (${res.status})`);
  }
  return await res.json();
}
async function fetchCounties() {
  if (USE_MOCK) return delay(COUNTIES);
  const raw = await get("/counties");
  return countyListSchema.parse(raw);
}
async function fetchProjects() {
  if (USE_MOCK) return delay(PROJECTS);
  const raw = await get("/projects");
  return projectListSchema.parse(raw);
}
async function fetchFacilities() {
  if (USE_MOCK) return delay(FACILITIES);
  const raw = await get("/facilities");
  return facilityListSchema.parse(raw);
}
function computeStats(counties, projects) {
  const fundingBySector = {
    health: 0,
    education: 0,
    water: 0,
    infrastructure: 0,
    agriculture: 0,
    climate: 0,
    energy: 0
  };
  const projectsByDonor = {};
  for (const p of projects) {
    fundingBySector[p.sector] += p.budget;
    projectsByDonor[p.donor] = (projectsByDonor[p.donor] ?? 0) + 1;
  }
  return {
    population: counties.reduce((a, c) => a + c.population, 0),
    hospitals: counties.reduce((a, c) => a + c.hospitals, 0),
    schools: counties.reduce((a, c) => a + c.schools, 0),
    roadLengthKm: counties.reduce((a, c) => a + c.roadLengthKm, 0),
    projects: projects.length,
    totalFunding: projects.reduce((a, p) => a + p.budget, 0),
    fundingBySector,
    projectsByDonor
  };
}
function countiesToGeoJSON(counties) {
  return {
    type: "FeatureCollection",
    features: counties.map((c, i) => {
      const ring = c.boundary?.length ? c.boundary : COUNTY_POLYGONS[i % COUNTY_POLYGONS.length];
      return {
        type: "Feature",
        properties: { id: c.id, name: c.name, needScore: c.needScore },
        geometry: { type: "Polygon", coordinates: [ring] }
      };
    })
  };
}
function facilitiesToGeoJSON(facilities) {
  return {
    type: "FeatureCollection",
    features: facilities.map(
      (f) => ({
        type: "Feature",
        properties: { id: f.id, name: f.name, type: f.type },
        geometry: { type: "Point", coordinates: f.coordinates }
      })
    )
  };
}
function projectsToGeoJSON(projects) {
  return {
    type: "FeatureCollection",
    features: projects.map(
      (p) => ({
        type: "Feature",
        properties: { id: p.id, title: p.title, sector: p.sector, status: p.status },
        geometry: { type: "Point", coordinates: p.coordinates }
      })
    )
  };
}
function buildSearchIndex(counties, facilities, projects) {
  return [
    ...counties.map((c) => ({ id: c.id, label: c.name, kind: "county", coordinates: c.centroid })),
    ...facilities.map(
      (f) => ({ id: f.id, label: f.name, kind: f.type, coordinates: f.coordinates })
    ),
    ...projects.map(
      (p) => ({ id: p.id, label: p.title, kind: "project", coordinates: p.coordinates })
    )
  ];
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let counties;
  let allProjects;
  let facilities;
  let loading;
  let filteredProjects;
  let countiesGeo;
  let projectsGeo;
  let facilitiesGeo;
  let searchIndex;
  let $filters, $$unsubscribe_filters;
  let $facilitiesQuery, $$unsubscribe_facilitiesQuery;
  let $projectsQuery, $$unsubscribe_projectsQuery;
  let $countiesQuery, $$unsubscribe_countiesQuery;
  let $activeFilterCount, $$unsubscribe_activeFilterCount;
  $$unsubscribe_filters = subscribe(filters, (value) => $filters = value);
  $$unsubscribe_activeFilterCount = subscribe(activeFilterCount, (value) => $activeFilterCount = value);
  let tab = "layers";
  const countiesQuery = createQuery({
    queryKey: ["counties"],
    queryFn: fetchCounties
  });
  $$unsubscribe_countiesQuery = subscribe(countiesQuery, (value) => $countiesQuery = value);
  const projectsQuery = createQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects
  });
  $$unsubscribe_projectsQuery = subscribe(projectsQuery, (value) => $projectsQuery = value);
  const facilitiesQuery = createQuery({
    queryKey: ["facilities"],
    queryFn: fetchFacilities
  });
  $$unsubscribe_facilitiesQuery = subscribe(facilitiesQuery, (value) => $facilitiesQuery = value);
  const TABS = [
    {
      id: "layers",
      label: "Layers",
      icon: "layers"
    },
    {
      id: "filters",
      label: "Filters",
      icon: "filter"
    },
    {
      id: "insights",
      label: "Insights",
      icon: "chart"
    }
  ];
  counties = $countiesQuery.data ?? [];
  allProjects = $projectsQuery.data ?? [];
  facilities = $facilitiesQuery.data ?? [];
  loading = $countiesQuery.isLoading || $projectsQuery.isLoading || $facilitiesQuery.isLoading;
  filteredProjects = applyProjectFilters(allProjects, $filters, counties);
  computeStats(counties, filteredProjects);
  countiesGeo = countiesToGeoJSON(counties);
  projectsGeo = projectsToGeoJSON(filteredProjects);
  facilitiesGeo = facilitiesToGeoJSON(facilities);
  searchIndex = buildSearchIndex(counties, facilities, allProjects);
  $$unsubscribe_filters();
  $$unsubscribe_facilitiesQuery();
  $$unsubscribe_projectsQuery();
  $$unsubscribe_countiesQuery();
  $$unsubscribe_activeFilterCount();
  return `${$$result.head += `<!-- HEAD_svelte-cjmlmr_START -->${$$result.title = `<title>AtlasAid — Development Intelligence</title>`, ""}<!-- HEAD_svelte-cjmlmr_END -->`, ""} <div class="flex h-dvh min-h-0 flex-col overflow-hidden bg-ink-950"> <header class="z-30 flex items-center gap-3 border-b border-ink-600 bg-ink-900 px-3 py-2.5"><button class="btn-ghost !px-2 md:!hidden" aria-label="Toggle panel">${validate_component(Icon, "Icon").$$render($$result, { name: "layers" }, {}, {})}</button> <a href="/" class="flex items-center gap-2.5 pr-2" data-svelte-h="svelte-c5c2w6"><svg width="24" height="24" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 5 25 27 H7 Z" fill="none" stroke="#2DD4BF" stroke-width="2" stroke-linejoin="round"></path><circle cx="16" cy="19" r="2.4" fill="#2DD4BF"></circle></svg> <div class="leading-none"><span class="text-[15px] font-semibold tracking-tight text-fg">AtlasAid</span> <span class="ml-1 hidden align-middle text-[11px] text-fg-faint sm:inline">Development Intelligence</span></div></a> <div class="mx-auto w-full max-w-xl">${validate_component(SearchBar, "SearchBar").$$render($$result, { index: searchIndex }, {}, {})}</div> <div class="relative"><button class="btn-outline">${validate_component(Icon, "Icon").$$render($$result, { name: "download", size: 16 }, {}, {})} <span class="hidden sm:inline" data-svelte-h="svelte-1obcedq">Export</span></button> ${``}</div></header> <div class="relative flex min-h-0 flex-1 overflow-hidden"> <aside class="${"absolute z-20 flex h-full w-[340px] max-w-[88vw] flex-col border-r border-ink-600 bg-ink-900 shadow-rail transition-transform md:static md:shadow-none " + escape(
    "translate-x-0",
    true
  )}"><nav class="flex border-b border-ink-600">${each(TABS, (t) => {
    return `<button class="${"relative flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors " + escape(
      tab === t.id ? "text-accent" : "text-fg-muted hover:text-fg",
      true
    )}">${validate_component(Icon, "Icon").$$render($$result, { name: t.icon, size: 15 }, {}, {})} ${escape(t.label)} ${t.id === "filters" && $activeFilterCount ? `<span class="tnum rounded-full bg-accent px-1.5 text-[10px] text-ink-950">${escape($activeFilterCount)}</span>` : ``} ${tab === t.id ? `<span class="absolute inset-x-0 bottom-0 h-0.5 bg-accent"></span>` : ``} </button>`;
  })}</nav> <div class="flex-1 overflow-auto p-3.5">${loading ? `<div class="grid h-40 place-items-center">${validate_component(Spinner, "Spinner").$$render($$result, { label: "Loading data" }, {}, {})}</div>` : `${`${validate_component(LayerPanel, "LayerPanel").$$render($$result, {}, {}, {})}`}`}</div> <footer class="border-t border-ink-600 px-3.5 py-2.5"><p class="flex items-center gap-1.5 text-[11px] text-fg-faint"><span class="${"h-1.5 w-1.5 rounded-full " + escape(USE_MOCK ? "bg-need-mid" : "bg-need-low", true)}"></span> ${escape(USE_MOCK ? "Mock data — set PUBLIC_API_BASE_URL for live" : "Live API")}</p></footer></aside>  <main class="relative min-h-0 flex-1 overflow-hidden">${validate_component(MapCanvas, "MapCanvas").$$render($$result, { countiesGeo, projectsGeo, facilitiesGeo }, {}, {})}  <div class="pointer-events-none absolute bottom-4 left-4 z-10">${validate_component(MapLegend, "MapLegend").$$render($$result, {}, {}, {})}</div>  <div class="pointer-events-none absolute right-3 top-3 z-10 flex max-h-[calc(100%-1.5rem)]">${validate_component(ProjectDetail, "ProjectDetail").$$render($$result, { counties, projects: allProjects }, {}, {})}</div></main></div></div>`;
});
export {
  Page as default
};
