<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	type Book = {
		page: string;
		url: string;
	};

	let cachedBooks: Book[] = [];

	onMount(async () => {
		const { cache } = await import('$lib/cache');

		const cachedRequests = await cache.keys();
		const libraryBuilder = cachedRequests
			.map(async (request) => {
				const response = await cache.match(request);
				const blob = await response?.blob();

				const bookCoverUrl = new URL(request.url).pathname.slice(1);
				const bookName = bookCoverUrl.split('+')[0].split('.')[0];

				return {
					page: bookName,
					url: blob ? URL.createObjectURL(blob) : ''
				};
			})
			.filter(async (url) => !!url);

		cachedBooks = await Promise.all(libraryBuilder);
	});

	onDestroy(() => {
		for (const book of cachedBooks) {
			URL.revokeObjectURL(book.url);
		}
	});
</script>

<div><a href="/">Upload</a></div>
{#each cachedBooks as book}
	<a href="/reader/{book.page}">
		<img src={book.url} loading="lazy" alt="" width="200" />
	</a>
{/each}
