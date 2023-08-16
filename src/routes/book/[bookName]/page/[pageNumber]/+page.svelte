<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { books } from '$lib/bookStore';
	import { getPageUrl } from '$lib/getPageUrl';
	import { onMount } from 'svelte';

	let pageUrl: string;
	$: {
		(async () => {
			if (browser) {
				const url = await getPageUrl(+$page.params.pageNumber, $page.params.bookName, $books);
				pageUrl = url;
			}
		})();
	}

	onMount(async () => {
		const url = await getPageUrl(+$page.params.pageNumber, $page.params.bookName, $books);
		pageUrl = url;

		books.addPageUrls({ bookName: $page.params.bookName, urls: [url] });
	});

	async function onArrow(event: KeyboardEvent) {
		const pages = $books.get($page.params.bookName)?.pages ?? [];
		const currentIndex = +$page.params.pageNumber;

		if (event.key === 'ArrowRight') {
			const lastPage = pages.length - 1;
			const nextPage = currentIndex + 1 >= lastPage ? lastPage : currentIndex + 1;
			goto(`/book/${$page.params.bookName}/page/${nextPage}`);
		}

		if (event.key === 'ArrowLeft') {
			const previousPage = currentIndex - 1 < 0 ? 0 : currentIndex - 1;
			goto(`/book/${$page.params.bookName}/page/${previousPage}`);
		}
	}
</script>

{#await pageUrl}
	<div>Loading...</div>
{:then url}
	{#if url}
		<img src={url} loading="lazy" alt="" width="700" />
	{/if}
{/await}
<svelte:window on:keyup={onArrow} />
