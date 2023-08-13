<script lang="ts">
	import { goto } from '$app/navigation';
	import { isImage } from '$lib/isImage';
	import { sortPagesCoverFirst } from '$lib/sortPages';
	import { writeFile } from '$lib/writeFile';

	async function onChange(event: Event & { currentTarget: HTMLInputElement }) {
		const { Archive, CompressedFile } = await import('$lib/archive');
		const { covers, books } = await import('$lib/directories');

		const files = (event.target as HTMLInputElement)?.files ?? [];
		const processFiles = Array.from(files).map(async (file) => {
			try {
				const bookName = file.name.split('.')[0];
				const bookDirectory = await books.getDirectoryHandle(bookName, { create: true });
				writeFile(bookName, bookDirectory, file);

				const archive = await Archive.open(file);
				const archivedFiles = await archive.getFilesArray();
				const imageFiles = archivedFiles.filter(isImage).sort(sortPagesCoverFirst);

				const coverHandle = imageFiles[0].file;
				const coverDirectory = await covers.getDirectoryHandle(bookName, { create: true });

				if (coverHandle instanceof CompressedFile) {
					const cover = await coverHandle.extract();
					writeFile(coverHandle.name, coverDirectory, cover);
					await writeFile(coverHandle.name, bookDirectory, cover);
				}

				return { bookName, firstPageName: coverHandle.name };
			} catch (e) {
				console.error(e);
			}
		});

		const [entry] = await Promise.all(processFiles);
		if (files.length === 1) {
			goto(`/book/${entry?.bookName}/page/${entry?.firstPageName}`);
		} else {
			goto('/books');
		}
	}
</script>

<input on:change={onChange} type="file" accept=".cbr, .rar, .cbz, .zip" multiple />
