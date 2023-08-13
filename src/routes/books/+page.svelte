<script lang="ts">
	import type { IterableDirectory } from '$lib/directories';
	import { onDestroy, onMount } from 'svelte';

	type Book = {
		name: string;
		firstPage: string;
		url: string;
	};

	let books: Book[] = [];

	onMount(async () => {
		const { covers } = await import('$lib/directories');

		for await (const [bookName, bookHandle] of covers) {
			if (bookHandle instanceof FileSystemDirectoryHandle) {
				for await (const [coverName, coverHandle] of bookHandle as IterableDirectory) {
					if (coverHandle instanceof FileSystemFileHandle) {
						const file = await coverHandle.getFile();
						const url = URL.createObjectURL(file);

						books = [{ name: bookName, firstPage: coverName, url }, ...books];
					}
				}
			}
		}
	});

	onDestroy(() => {
		for (const book of books) {
			URL.revokeObjectURL(book.url);
		}
	});
</script>

<div><a href="/">Upload</a></div>
{#each books as book}
	<a href="/book/{book.name}/page/{book.firstPage}">
		<img src={book.url} loading="lazy" alt="" width="200" />
	</a>
{/each}
