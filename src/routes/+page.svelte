<script lang="ts">
	import { goto } from '$app/navigation';
	import { isImage } from '$lib/isImage';
	import { type BookManifest, books } from '$lib/bookStore';
	import { sortPagesCoverFirst } from '$lib/sortPages';
	import { isMacOSFile } from '$lib/isMacOSFile';

	async function onUpload(event: Event & { currentTarget: HTMLInputElement }) {
		const { Archive, CompressedFile } = await import('$lib/archive');
		const { booksDirectory } = await import('$lib/directories');
		const { writeFile } = await import('$lib/writeFile');

		await navigator.storage.persist();

		const files = (event.target as HTMLInputElement)?.files ?? [];
		const processFiles = Array.from(files).map(async (file) => {
			try {
				const bookName = file.name.slice(0, file.name.length - 4);

				const archive = await Archive.open(file);
				const archivedFiles = await archive.getFilesArray();
				const pages = archivedFiles.filter(isMacOSFile).filter(isImage).sort(sortPagesCoverFirst);

				const coverHandle = pages[0].file;

				if (coverHandle instanceof CompressedFile) {
					const cover = await coverHandle.extract();

					const bookDirectory = await booksDirectory.getDirectoryHandle(bookName, { create: true });
					writeFile(bookName, bookDirectory, file);

					const coverUrl = URL.createObjectURL(cover);
					const manifest: BookManifest = {
						name: bookName,
						pages: pages.map((page) => page.file.name),
						pageUrls: [coverUrl]
					};

					books.add(bookName, manifest);
					await writeFile(`0`, bookDirectory, cover);
				}

				// @ts-expect-error _worker is private, but workers don't terminate properly
				archive._worker.terminate();
				return bookName;
			} catch (e) {
				console.error(e);
				return null;
			}
		});

		try {
			const [entry] = await Promise.all(processFiles);
			if (files.length === 1 && entry) {
				goto(`/book/${entry}/page/0`);
			} else {
				goto('/books');
			}
		} catch {}
	}
</script>

<input on:change={onUpload} type="file" accept=".cbr, .rar, .cbz, .zip" multiple />
