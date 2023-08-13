<script lang="ts">
	import { goto } from '$app/navigation';
	import { isImage } from '$lib/isImage';
	import { sortPagesCoverFirst } from '$lib/sortPages';

	async function onChange(event: Event & { currentTarget: HTMLInputElement }) {
		const { Archive, CompressedFile } = await import('$lib/archive');
		const { cache } = await import('$lib/cache');

		const files = (event.target as HTMLInputElement)?.files ?? [];
		const processFiles = Array.from(files).map(async (file) => {
			try {
				const bookKey = file.name.split('.')[0];
				const bookMatch = await cache.match(bookKey, { ignoreSearch: true });
				if (!bookMatch) {
					cache.put(`book/${bookKey}`, new Response(file));
				}

				const archive = await Archive.open(file);
				const archivedFiles = await archive.getFilesArray();
				const imageFiles = archivedFiles.filter(isImage).sort(sortPagesCoverFirst);

				const coverRef = imageFiles[0].file;
				const coverKey = `book/${bookKey}/page/${coverRef.name}`;
				const coverMatch = await cache.match(coverKey, { ignoreSearch: true });

				if (!coverMatch && coverRef instanceof CompressedFile) {
					const cover = await coverRef.extract();
					await cache.put(coverKey, new Response(cover));
				}
			} catch (e) {
				console.error(e);
			}
		});

		await Promise.all(processFiles);
		goto('/books');
	}
</script>

<input on:change={onChange} type="file" accept=".cbr, .rar, .cbz, .zip" multiple />
