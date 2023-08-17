<script lang="ts">
	import { page } from '$app/stores';
	import { books } from '$lib/bookStore';
	import { onMount } from 'svelte';

	onMount(async () => {
		const { booksDirectory } = await import('$lib/directories');
		const { Archive } = await import('$lib/archive');

		const unsubscribe = books.subscribe(async ($books) => {
			if ($books.size > 0) {
				setTimeout(() => unsubscribe());
				const resolvedDir = await booksDirectory;
				const bookDirectory = await resolvedDir.getDirectoryHandle($page.params.bookName);
				const archiveHandle = await bookDirectory.getFileHandle($page.params.bookName);
				const archiveFile = await archiveHandle.getFile();

				const archive = await Archive.open(archiveFile);
				archive.extractFiles((file) => {
					const url = URL.createObjectURL(file.file);
					pages = [...pages, url];
				});
			}
		});
	});

	let pages = [] as string[];
</script>

{#each pages as pageUrl, i}
	<a href="/book/{$page.params.bookName}/page/{i}">
		<img src={pageUrl} loading="lazy" alt="" width="200" />
	</a>
{/each}
