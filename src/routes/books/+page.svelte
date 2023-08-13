<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	type Book = {
		name: string;
		firstPage: string;
		url: string;
	};

	let books: Book[] = [];

	onMount(async () => {
		const { covers } = await import('$lib/directories');

		for await (const [fileName, handle] of covers) {
			if (handle instanceof FileSystemFileHandle) {
				const file = await handle.getFile();
				const url = URL.createObjectURL(file);

				books = [{ name: fileName, firstPage: file.name, url }, ...books];
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
