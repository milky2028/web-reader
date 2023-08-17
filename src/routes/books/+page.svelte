<script lang="ts">
	import { books, getPage, type BookManifest } from '$lib/bookStore';
	import { derived, readable } from 'svelte/store';

	function getCovers($books: Map<string, BookManifest>) {
		return derived(
			[...$books].map(([bookName]) => getPage(0, bookName)),
			(cover) => cover
		);
	}

	let covers = readable([] as string[]);
	$: covers = getCovers($books);
</script>

{#if $books.size > 0}
	{#each $books as [bookName], i (bookName)}
		<a href="/book/{bookName}/page/0">
			<img src={$covers[i]} loading="lazy" alt="" width="200" />
		</a>
	{/each}
{:else}
	<div>No books uploaded</div>
{/if}
