<script lang="ts">
	import { goto } from '$app/navigation';
	import { CompressedFile } from 'libarchive.js/src/compressed-file';

	async function onChange(event: Event & { currentTarget: HTMLInputElement }) {
		const { Archive } = await import('$lib/archive');
		const { cache } = await import('$lib/cache');

		const files = (event.target as HTMLInputElement)?.files ?? [];
		const processFiles = Array.from(files).map(async (file) => {
			const archive = await Archive.open(file);
			const archivedFiles = await archive.getFilesArray();
			const imageFiles = archivedFiles.filter(
				({ file }) => file.name.endsWith('.jpg') || file.name.endsWith('.jpeg')
			);

			const coverRef = imageFiles[0].file;
			const cacheKey = `${file.name}+${coverRef.name}`;
			const cacheMatch = await cache.match(cacheKey);

			if (!cacheMatch && coverRef instanceof CompressedFile) {
				const cover = await coverRef.extract();
				await cache.put(cacheKey, new Response(cover, { status: 200 }));
			}
		});

		await Promise.all(processFiles);
		goto('/books');
	}
</script>

<input on:change={onChange} type="file" accept=".cbr, .rar, .cbz, .zip" multiple />
