<script lang="ts">
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';

	let url: string;

	function listenForArrowKey(event: KeyboardEvent) {
		if (event.key === 'ArrowRight') {
			console.log('go right');
		}

		if (event.key === 'ArrowLeft') {
			console.log('go left');
		}
	}

	onMount(async () => {
		const { books } = await import('$lib/directories');
		const bookHandle = await books.getDirectoryHandle($page.params.bookName);
		const pageHandle = await bookHandle.getFileHandle($page.params.pageName);

		const file = await pageHandle.getFile();
		url = URL.createObjectURL(file);
	});

	onDestroy(() => {
		URL.revokeObjectURL(url);
	});
</script>

<div><a href="/books">Books</a></div>
<img src={url} loading="lazy" alt="" width="700" />
<svelte:window on:keydown={listenForArrowKey} />
