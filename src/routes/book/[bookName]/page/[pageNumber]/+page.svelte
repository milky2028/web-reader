<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { books, getPage } from '$lib/bookStore';
	import { isLandscapeMode } from '$lib/isLandscapeMode';
	import { isTwoPageSpread } from '$lib/isTwoPageSpread';
	import { readable } from 'svelte/store';

	let firstPageUrl = readable('');
	$: firstPageUrl = getPage(+$page.params.pageNumber, $page.params.bookName);

	let secondPageUrl = readable('');
	$: secondPageUrl = getPage(+$page.params.pageNumber + 1, $page.params.bookName);

	let imgIsTwoPageSpread = false;
	$: (async () => {
		const [oneIs, twoIs] = await Promise.all([
			isTwoPageSpread($firstPageUrl),
			isTwoPageSpread($secondPageUrl)
		]);

		imgIsTwoPageSpread = oneIs || twoIs;
	})();

	let showingTwoPages = false;
	$: showingTwoPages = $isLandscapeMode && +$page.params.pageNumber !== 0 && !imgIsTwoPageSpread;

	let numberOfPagesToIncrement = 1;
	$: numberOfPagesToIncrement = showingTwoPages ? 2 : 1;

	async function onArrow(event: KeyboardEvent) {
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
</script>

<style>
	.page-container {
		display: grid;
		grid-template-areas: page1;
	}

	.landscape {
		grid-template-columns: 1fr min-content min-content 1fr;
		column-gap: 0.5rem;
		grid-template-areas: 'space1 page1 page2 space2';
	}

	img {
		max-width: 100vw;
		max-height: calc(100vh - 40px);
	}
</style>

<svelte:window on:keyup={onArrow} />
<div><a href="/book/{$page.params.bookName}">Pages</a></div>
<div class="page-container" class:landscape={showingTwoPages}>
	<img style="grid-area: page1;" src={$firstPageUrl} alt="" />
	{#if showingTwoPages}
		<img style="grid-area: page2;" src={$secondPageUrl} alt="" />
	{/if}
</div>
