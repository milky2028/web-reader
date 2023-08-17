<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { books, getPage } from '$lib/bookStore';
	import { readable } from 'svelte/store';

	let pageUrl = readable('');
	$: pageUrl = getPage(+$page.params.pageNumber, $page.params.bookName);

	async function onArrow(event: KeyboardEvent) {
		event.preventDefault();
		event.stopImmediatePropagation();

		const pages = $books.get($page.params.bookName)?.pages ?? [];
		const currentIndex = +$page.params.pageNumber;

		if (event.key === 'ArrowRight') {
			const lastPage = pages.length - 1;
			const nextPage = currentIndex + 1 >= lastPage ? lastPage : currentIndex + 1;

			await books.createPage(nextPage, $page.params.bookName, $books);
			books.createPage(nextPage + 1, $page.params.bookName, $books);
			books.createPage(nextPage + 2, $page.params.bookName, $books);
			goto(`/book/${$page.params.bookName}/page/${nextPage}`);
		}

		if (event.key === 'ArrowLeft') {
			const previousPage = currentIndex - 1 < 0 ? 0 : currentIndex - 1;
			goto(`/book/${$page.params.bookName}/page/${previousPage}`);
		}
	}
</script>

<style>
	.page-container {
		display: grid;
		place-items: center;
	}

	img {
		max-width: 100vw;
		max-height: calc(100vh - 40px);
	}
</style>

<svelte:window on:keyup={onArrow} />
<div><a href="/book/{$page.params.bookName}">Pages</a></div>
<div class="page-container"><img src={$pageUrl} alt="" /></div>
