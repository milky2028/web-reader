import type { BookManifest } from './bookStore';
import { exists } from './exists';
import { getFile } from './getFile';
import { writeFile } from './writeFile';

function decodeImage(url: string) {
	const img = new Image();
	img.src = url;
	return img.decode();
}

export async function extractPage(
	pageNumber: number,
	bookName: string,
	$books: Map<string, BookManifest>
) {
	const { booksDirectory } = await import('$lib/directories');
	const { Archive } = await import('$lib/archive');

	const bookHandle = await booksDirectory.getDirectoryHandle(bookName);
	const book = $books.get(bookName);
	let url = book?.pageUrls[pageNumber];

	if (book) {
		if (!url) {
			if (await exists(`${pageNumber}`, bookHandle)) {
				const file = await getFile(`${pageNumber}`, bookHandle);

				url = URL.createObjectURL(file);
				book.pageUrls[pageNumber] = url;
				await decodeImage(url);

				return $books;
			}

			const archiveFile = await getFile(bookName, bookHandle);
			const archive = await Archive.open(archiveFile);

			const pageFileName = $books.get(bookName)?.pages[pageNumber];
			if (pageFileName) {
				const file = await archive.extractSingleFile(`${book.path}${pageFileName}`);

				url = URL.createObjectURL(file);
				book.pageUrls[pageNumber] = url;
				await decodeImage(url);

				// @ts-expect-error _worker is private, but workers don't terminate properly
				archive._worker.terminate();

				await writeFile(`${pageNumber}`, bookHandle, file);
				return $books;
			}
		}
	}

	return null;
}
