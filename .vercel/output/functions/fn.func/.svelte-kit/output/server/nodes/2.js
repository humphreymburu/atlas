

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.C31Fk4Me.js","_app/immutable/chunks/scheduler.D8CWxZS0.js","_app/immutable/chunks/index.QKd2dYct.js","_app/immutable/chunks/preload-helper.C1FmrZbK.js","_app/immutable/chunks/index.BjYOixqj.js","_app/immutable/chunks/context.BS0lL05P.js"];
export const stylesheets = ["_app/immutable/assets/2.Bc17DTGM.css"];
export const fonts = [];
