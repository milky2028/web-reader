<script lang="ts">
	import { goto } from '$app/navigation';

	async function onChange(event: Event & { currentTarget: HTMLInputElement }) {
		const { Archive } = await import('$lib/archive');
		const { cache } = await import('$lib/cache');

		const files = (event.target as HTMLInputElement)?.files ?? [];
		for (const file of files) {
			const archive = await Archive.open(file);
			const archivedFiles = await archive.getFilesObject();

			const frontCover = await archive.extractSingleFile(Object.keys(archivedFiles)[0]);
			const cacheKey = `${file.name}+${frontCover.name}`;

			await cache.put(cacheKey, new Response(frontCover, { status: 200 }));
			goto('/books');
		}
	}
</script>

<input on:change={onChange} type="file" accept=".cbr, .rar, .cbz, .zip" multiple />
