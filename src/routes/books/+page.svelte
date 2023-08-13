<script lang="ts">
	import { MANIFEST, type BookManifest } from '$lib/manifest';
	import { onDestroy, onMount } from 'svelte';

	type Book = {
		name: string;
		firstPage: string;
		url: string;
	};

	let savedBooks: Book[] = [];

	onMount(async () => {
		const { books } = await import('$lib/directories');

		for await (const [bookName, bookHandle] of books) {
			try {
				if (bookHandle instanceof FileSystemDirectoryHandle) {
					const manifestHandle = await bookHandle.getFileHandle(MANIFEST);

					const manifest = JSON.parse(
						await (await manifestHandle.getFile()).text()
					) as BookManifest;

					const coverHandle = await bookHandle.getFileHandle(manifest.cover);
					const cover = await coverHandle.getFile();

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
{#each savedBooks as book (book.name)}
	<a href="/book/{book.name}/page/{book.firstPage}">
		<img src={book.url} loading="lazy" alt="" width="200" />
	</a>
{/each}
