export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".well-known/appspecific/com.chrome.devtools.json","favicon.svg"]),
	mimeTypes: {".json":"application/json",".svg":"image/svg+xml"},
	_: {
		client: {"start":"_app/immutable/entry/start.CGB73h7Y.js","app":"_app/immutable/entry/app.C56MdJ0X.js","imports":["_app/immutable/entry/start.CGB73h7Y.js","_app/immutable/chunks/entry.CfrAPYj3.js","_app/immutable/chunks/scheduler.D8CWxZS0.js","_app/immutable/chunks/index.BjYOixqj.js","_app/immutable/entry/app.C56MdJ0X.js","_app/immutable/chunks/preload-helper.C1FmrZbK.js","_app/immutable/chunks/scheduler.D8CWxZS0.js","_app/immutable/chunks/index.QKd2dYct.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":true},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
