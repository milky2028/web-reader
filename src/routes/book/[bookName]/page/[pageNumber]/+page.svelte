<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { books, getPage } from '$lib/bookStore';
	import { isLandscapeMode } from '$lib/isLandscapeMode';
	import { readable } from 'svelte/store';

	let firstPageUrl = readable('');
	$: firstPageUrl = getPage(+$page.params.pageNumber, $page.params.bookName);

	let secondPageUrl = readable('');
	$: secondPageUrl = getPage(+$page.params.pageNumber + 1, $page.params.bookName);

	async function onArrow(event: KeyboardEvent) {
		const numberOfPagesToIncrement = showingTwoPages ? 2 : 1;

		const pages = $books.get($page.params.bookName)?.pages ?? [];
		const currentIndex = +$page.params.pageNumber;

		if (event.key === 'ArrowRight') {
			const lastPage = pages.length - 1;

			const nextPage =
				currentIndex + numberOfPagesToIncrement >= lastPage
					? lastPage
					: currentIndex + numberOfPagesToIncrement;

			await Promise.all([
				books.createPage(nextPage, $page.params.bookName, $books),
				books.createPage(nextPage + 1, $page.params.bookName, $books)
			]);

			books.createPage(nextPage + 2, $page.params.bookName, $books);
			books.createPage(nextPage + 3, $page.params.bookName, $books);

			goto(`/book/${$page.params.bookName}/page/${nextPage}`);
		}

		if (event.key === 'ArrowLeft') {
			const previousPage =
				currentIndex - numberOfPagesToIncrement < 0 ? 0 : currentIndex - numberOfPagesToIncrement;
			goto(`/book/${$page.params.bookName}/page/${previousPage}`);
		}
	}

	let showingTwoPages = false;
	$: showingTwoPages = $isLandscapeMode && +$page.params.pageNumber !== 0;
</script>

<style>
	.page-container {
		display: grid;
		place-items: center;
	}

	.landscape {
		grid-template-columns: 1fr 1fr;
	}

	img {
		max-width: 100vw;
		max-height: calc(100vh - 40px);
	}
</style>

<svelte:window on:keyup={onArrow} />
<div><a href="/book/{$page.params.bookName}">Pages</a></div>
<div class="page-container" class:landscape={showingTwoPages}>
	<img src={$firstPageUrl} alt="" />
	{#if showingTwoPages}
		<img src={$secondPageUrl} alt="" />
	{/if}
</div>
