<script lang="ts">
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';

	let url: string;

	onMount(async () => {
		const { books } = await import('$lib/directories');
		const bookHandle = await books.getDirectoryHandle($page.params.bookName);
		const pageHandle = await bookHandle.getFileHandle($page.params.pageName);

		for await (const item of books) {
			console.log(item);
		}

		const file = await pageHandle.getFile();
		url = URL.createObjectURL(file);
	});

	onDestroy(() => {
		URL.revokeObjectURL(url);
	});
</script>

<img src={url} loading="lazy" alt="" />
