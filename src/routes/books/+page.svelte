<script lang="ts">
	import { books, getPage, type BookManifest } from '$lib/bookStore';
	import { derived, readable } from 'svelte/store';

	const sortedBooks = derived(books, (books) =>
		[...books].sort(([bookNameA], [bookNameB]) => bookNameA.localeCompare(bookNameB))
	);

	function getCovers($sortedBooks: [string, BookManifest][]) {
		return derived(
			$sortedBooks.map(([bookName]) => getPage(0, bookName)),
			(covers) => covers
		);
	}

	let covers = readable([] as string[]);
	$: covers = getCovers($sortedBooks);
</script>

{#if $books.size > 0}
	{#each $sortedBooks as [bookName], i (bookName)}
		<a href="/book/{bookName}/page/0">
			<img src={$covers[i]} loading="lazy" alt="" width="200" />
		</a>
	{/each}
{:else}
	<div>No books uploaded</div>
{/if}
