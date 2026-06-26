<script lang="ts">
	import '../app.css';
	import { QueryClient } from '@tanstack/query-core';
	import { QueryClientProvider } from '@tanstack/svelte-query';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { staleTime: 60_000, refetchOnWindowFocus: false, retry: 1 }
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<slot />
</QueryClientProvider>
