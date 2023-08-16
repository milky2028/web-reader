<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { books, getPage } from '$lib/bookStore';

	let pageUrl = getPage(+$page.params.pageNumber, $page.params.bookName);
	$: pageUrl = getPage(+$page.params.pageNumber, $page.params.bookName);

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

		await books.cachePages(+$page.params.pageNumber, $page.params.bookName, $books);
	}
</script>

<img src={$pageUrl} loading="lazy" alt="" width="700" />
<svelte:window on:keyup={onArrow} />
