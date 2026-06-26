import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.CQ9dsuvg.js","_app/immutable/chunks/scheduler.D8CWxZS0.js","_app/immutable/chunks/index.QKd2dYct.js","_app/immutable/chunks/context.BS0lL05P.js","_app/immutable/chunks/index.BjYOixqj.js"];
export const stylesheets = ["_app/immutable/assets/0.DakjxI2N.css"];
export const fonts = [];
