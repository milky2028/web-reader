<script lang="ts">
	import { books } from '$lib/bookStore';
	import { getPageUrl } from '$lib/getPageUrl';
	import { onMount } from 'svelte';

	type Cover = {
		url: string;
		bookName: string;
	};

	let covers: Cover[] = [];

	onMount(async () => {
		const processCovers = [...$books].map(async ([bookName]) => {
			const url = await getPageUrl(0, bookName, $books);
			return { url, bookName };
		});

		covers = await Promise.all(processCovers);
		books.addPageUrls(...covers.map(({ bookName, url }) => ({ bookName, urls: [url] })));
	});
</script>

{#each covers as cover}
	<a href="/book/{cover.bookName}/page/0">
		<img src={cover.url} loading="lazy" alt="" width="200" />
	</a>
{/each}
