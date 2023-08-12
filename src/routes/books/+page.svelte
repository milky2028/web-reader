<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	let cachedBooks: string[] = [];

	onMount(async () => {
		const { cache } = await import('$lib/cache');

		const cachedRequests = await cache.keys();
		const libraryBuilder = cachedRequests
			.map(async (request) => {
				const response = await cache.match(request);
				const blob = await response?.blob();

				if (blob) {
					return URL.createObjectURL(blob);
				}

				return '';
			})
			.filter(async (url) => !!url);

		cachedBooks = await Promise.all(libraryBuilder);
	});

	onDestroy(() => {
		for (const book of cachedBooks) {
			URL.revokeObjectURL(book);
		}
	});
</script>

<a href="/">Upload</a>
{#each cachedBooks as book}
	<img src={book} loading="lazy" alt="" width="200" />
{/each}
