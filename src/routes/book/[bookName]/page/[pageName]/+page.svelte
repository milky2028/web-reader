<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';

	let url: string;

	async function onArrow(event: KeyboardEvent) {
		const { getManifest } = await import('$lib/manifest');
		const { books } = await import('$lib/directories');

		const bookHandle = await books.getDirectoryHandle($page.params.bookName);
		const { pages } = await getManifest(bookHandle);

		const currentPage = pages.findIndex((page) => page === $page.params.pageName);

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
		url = URL.createObjectURL(file);

		page.subscribe(async ({ params }) => {
			const file = await getPage(params.pageName, params.bookName);
			url = URL.createObjectURL(file);
		});
	});

	onDestroy(() => {
		URL.revokeObjectURL(url);
	});
</script>

<div><a href="/books">Books</a></div>
<img src={url} loading="lazy" alt="" width="700" />
<svelte:window on:keyup={onArrow} />
