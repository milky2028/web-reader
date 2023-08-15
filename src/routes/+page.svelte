<script lang="ts">
	import { goto } from '$app/navigation';
	import { isImage } from '$lib/isImage';
	import type { BookManifest } from '$lib/manifest';
	import { sortPagesCoverFirst } from '$lib/sortPages';

	async function onChange(event: Event & { currentTarget: HTMLInputElement }) {
		const { Archive, CompressedFile } = await import('$lib/archive');
		const { books } = await import('$lib/directories');
		const { writeFile } = await import('$lib/writeFile');
		const { writeManifest } = await import('$lib/manifest');

		const files = (event.target as HTMLInputElement)?.files ?? [];
		const processFiles = Array.from(files).map(async (file) => {
			try {
				const bookName = file.name.split('.')[0];

				const archive = await Archive.open(file);
				const archivedFiles = await archive.getFilesArray();
				const pages = archivedFiles.filter(isImage).sort(sortPagesCoverFirst);

				const coverHandle = pages[0].file;

				if (coverHandle instanceof CompressedFile) {
					const cover = await coverHandle.extract();

					const bookDirectory = await books.getDirectoryHandle(bookName, { create: true });
					writeFile(bookName, bookDirectory, file);

					const manifest: BookManifest = {
						cover: coverHandle.name,
						pages: pages.map((page) => page.file.name),
						pageUrls: []
					};

					await writeManifest(manifest, bookDirectory);
					await writeFile(coverHandle.name, bookDirectory, cover);
				}

				return { bookName, firstPageName: coverHandle.name };
			} catch (e) {
				console.error(e);
			}
		});

		try {
			const [entry] = await Promise.all(processFiles);
			if (files.length === 1) {
				goto(`/book/${entry?.bookName}/page/${entry?.firstPageName}`);
			} else {
				goto('/books');
			}
		} catch {}
	}
</script>

<input on:change={onChange} type="file" accept=".cbr, .rar, .cbz, .zip" multiple />
