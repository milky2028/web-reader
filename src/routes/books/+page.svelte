<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	type Book = {
		name: string;
		firstPage: string;
		url: string;
	};

	let savedBooks: Book[] = [];

	onMount(async () => {
		const { books } = await import('$lib/directories');
		const { getManifest } = await import('$lib/manifest');
		const { getFile } = await import('$lib/getFile');

		for await (const [bookName, bookHandle] of books) {
			try {
				if (bookHandle instanceof FileSystemDirectoryHandle) {
					const manifest = await getManifest(bookName);
					const cover = await getFile(manifest.cover, bookHandle);

					const url = URL.createObjectURL(cover);
					savedBooks = [{ name: bookName, firstPage: manifest.cover, url }, ...savedBooks];
				}
			} catch (e) {
				console.error(e);
			}
		}
	});

	onDestroy(() => {
		for (const book of savedBooks) {
			URL.revokeObjectURL(book.url);
		}
	});
</script>

<div><a href="/">Upload</a></div>
<div><a href="/books">Books</a></div>
{#each savedBooks as book (book.name)}
	<a href="/book/{book.name}/page/{book.firstPage}">
		<img src={book.url} loading="lazy" alt="" width="200" />
	</a>
{/each}
