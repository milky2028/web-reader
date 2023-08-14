<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { cachePages } from '$lib/cachePages';
	import { onDestroy, onMount } from 'svelte';

	const createdPages: string[] = [];
	let url: string;

	async function getCurrentPage() {
		const { getManifest } = await import('$lib/manifest');

		const { pages } = await getManifest($page.params.bookName);
		const currentPage = pages.findIndex((page) => page === $page.params.pageName);

		return { currentPage, pages };
	}

	async function onArrow(event: KeyboardEvent) {
		const { currentPage, pages } = await getCurrentPage();

		if (event.key === 'ArrowRight') {
			const lastPage = pages.length - 1;
			const nextPage = currentPage + 1 >= lastPage ? lastPage : currentPage + 1;
			goto(`/book/${$page.params.bookName}/page/${pages[nextPage]}`);
		}

		if (event.key === 'ArrowLeft') {
			const previousPage = currentPage - 1 < 0 ? 0 : currentPage - 1;
			goto(`/book/${$page.params.bookName}/page/${pages[previousPage]}`);
		}
	}

	onMount(async () => {
		const { getPage } = await import('$lib/getPage');

		const file = await getPage($page.params.pageName, $page.params.bookName);
		const objectUrl = URL.createObjectURL(file);
		createdPages.push(objectUrl);
		url = objectUrl;

		page.subscribe(async ({ params }) => {
			const file = await getPage(params.pageName, params.bookName);
			const { currentPage } = await getCurrentPage();
			cachePages(currentPage, $page.params.bookName);

			const objectUrl = URL.createObjectURL(file);
			createdPages.push(objectUrl);
			url = objectUrl;
		});

		const { currentPage } = await getCurrentPage();
		cachePages(currentPage, $page.params.bookName);
	});

	onDestroy(() => {
		for (const url of createdPages) {
			URL.revokeObjectURL(url);
		}
	});
</script>

<div><a href="/">Upload</a></div>
<div><a href="/books">Books</a></div>
<img src={url} loading="lazy" alt="" width="700" />
<svelte:window on:keyup={onArrow} />
