<script lang="ts">
	import { page } from '$app/stores';
	import { isImage } from '$lib/isImage';
	import { sortPagesForReading } from '$lib/sortPages';
	import { onDestroy, onMount } from 'svelte';

	let pageUrls: string[] = [];

	onMount(async () => {
		const { cache } = await import('$lib/cache');
		const { Archive, CompressedFile } = await import('$lib/archive');

		const bookMatch = await cache.match(location.href, { ignoreSearch: true });
		if (bookMatch) {
			const file = (await bookMatch.blob()) as File;
			const archive = await Archive.open(file);
			const files = await archive.getFilesArray();

			const processPages = files
				.filter(isImage)
				.sort(sortPagesForReading)
				.map(async ({ file }) => {
					const pageKey = `book/${$page.params.bookName}/page/${file.name}`;
					const pageMatch = await cache.match(pageKey, { ignoreSearch: true });
					if (pageMatch) {
						await pageMatch.blob();
					}

					if (file instanceof CompressedFile) {
						const blob = await file.extract();
						return URL.createObjectURL(blob);
					}

					return '';
				})
				.filter((url) => !!url);

			pageUrls = await Promise.all(processPages);
		}
	});

	onDestroy(() => {
		for (const url of pageUrls) {
			URL.revokeObjectURL(url);
		}
	});
</script>

{$page.params.bookName}
{#each pageUrls as url}
	<img src={url} loading="lazy" alt="" width="200" />
{/each}
