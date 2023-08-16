<script lang="ts">
	import { books } from '$lib/bookStore';
	import { onMount } from 'svelte';

	onMount(async () => {
		await books.intialize();
	});
</script>

<div><a href="/">Upload</a> <a href="/books">Books</a></div>

<slot />
