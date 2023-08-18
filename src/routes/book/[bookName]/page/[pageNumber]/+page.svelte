<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { books, getPage } from '$lib/bookStore';
	import { isLandscapeMode } from '$lib/isLandscapeMode';
	import { isTwoPageSpread } from '$lib/isTwoPageSpread';
	import { readable } from 'svelte/store';

	let pageNumber = +$page.params.pageNumber;
	$: pageNumber = +$page.params.pageNumber;

	let bookName = $page.params.bookName;
	$: bookName = $page.params.bookName;

	const lastPage = $books.get(bookName)?.pages.length ?? 0;

	let firstPageUrl = readable('');
	$: firstPageUrl = getPage(pageNumber, bookName);

	let secondPageUrl = readable('');
	$: secondPageUrl = getPage(pageNumber + 1, bookName);

	let showingTwoPages = false;
	$: (async () => {
		const [oneIs, twoIs] = await Promise.all([
			isTwoPageSpread($firstPageUrl),
			isTwoPageSpread($secondPageUrl)
		]);

		const imgIsTwoPageSpread = oneIs || twoIs;
		showingTwoPages = $isLandscapeMode && pageNumber !== 0 && !imgIsTwoPageSpread;
	})();

	let numberOfPagesToIncrement = 1;
	$: numberOfPagesToIncrement = showingTwoPages ? 2 : 1;

	async function onArrow(event: KeyboardEvent) {
		if (event.key === 'ArrowRight') {
			const nextPage =
				pageNumber + numberOfPagesToIncrement >= lastPage
					? lastPage
					: pageNumber + numberOfPagesToIncrement;

			await Promise.all([
				books.createPage(nextPage, $page.params.bookName, $books),
				books.createPage(nextPage + 1, $page.params.bookName, $books)
			]);

			books.createPage(nextPage + 2, $page.params.bookName, $books);
			books.createPage(nextPage + 3, $page.params.bookName, $books);

			goto(`/book/${bookName}/page/${nextPage}`);
		}

		if (event.key === 'ArrowLeft') {
			const previousPage =
				pageNumber - numberOfPagesToIncrement < 0 ? 0 : pageNumber - numberOfPagesToIncrement;
			goto(`/book/${bookName}/page/${previousPage}`);
		}
	}

	let pageContainer: HTMLDivElement | null = null;
	function requestFullscreen() {
		pageContainer?.requestFullscreen();
	}
</script>

<style>
	.page-container {
		display: grid;
		column-gap: 0.5rem;
		grid-template-columns: 1fr min-content 1fr;
		grid-template-areas: 'space1 page1 space2';
	}

	.landscape {
		grid-template-columns: 1fr min-content min-content 1fr;
		grid-template-areas: 'space1 page1 page2 space2';
	}

	img {
		max-width: 100vw;
		min-height: calc(100vh - 40px);
		max-height: calc(100vh - 40px);
	}
</style>

<svelte:window on:keyup={onArrow} />
<div>
	<a href="/book/{bookName}">Pages</a><button on:click={requestFullscreen}>Fullscreen</button>
</div>
<div bind:this={pageContainer} class="page-container" class:landscape={showingTwoPages}>
	<img style="grid-area: page1;" src={$firstPageUrl} alt="" />
	{#if showingTwoPages}
		<img style="grid-area: page2;" src={$secondPageUrl} alt="" />
	{/if}
</div>
