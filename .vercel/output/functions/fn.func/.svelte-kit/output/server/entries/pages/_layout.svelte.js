import { c as create_ssr_component, o as onDestroy, v as validate_component } from "../../chunks/ssr.js";
import { QueryClient } from "@tanstack/query-core";
import { s as setQueryClientContext } from "../../chunks/context.js";
const QueryClientProvider = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { client = new QueryClient() } = $$props;
  setQueryClientContext(client);
  onDestroy(() => {
    client.unmount();
  });
  if ($$props.client === void 0 && $$bindings.client && client !== void 0) $$bindings.client(client);
  return `${slots.default ? slots.default({}) : ``}`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 6e4,
        refetchOnWindowFocus: false,
        retry: 1
      }
    }
  });
  return `${validate_component(QueryClientProvider, "QueryClientProvider").$$render($$result, { client: queryClient }, {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
export {
  Layout as default
};
