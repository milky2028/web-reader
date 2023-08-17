import type { BookManifest } from './bookStore';
import { exists } from './exists';
import { getFile } from './getFile';
import { writeFile } from './writeFile';

export async function extractPage(
	pageNumber: number,
	bookName: string,
	$books: Map<string, BookManifest>
) {
	const { booksDirectory } = await import('$lib/directories');
	const { Archive } = await import('$lib/archive');

	const bookHandle = await booksDirectory.getDirectoryHandle(bookName);
	const book = $books.get(bookName);
	const url = book?.pageUrls[pageNumber];

	if (book) {
		if (!url) {
			if (await exists(`${pageNumber}`, bookHandle)) {
				const file = await getFile(`${pageNumber}`, bookHandle);
				book.pageUrls[pageNumber] = URL.createObjectURL(file);

				return $books;
			}

			const archiveFile = await getFile(bookName, bookHandle);
			const archive = await Archive.open(archiveFile);

			const pageFileName = $books.get(bookName)?.pages[pageNumber];
			if (pageFileName) {
				const file = await archive.extractSingleFile(`${book.path}${pageFileName}`);

				// @ts-expect-error _worker is private, but workers don't terminate properly
				archive._worker.terminate();
				book.pageUrls[pageNumber] = URL.createObjectURL(file);

				await writeFile(`${pageNumber}`, bookHandle, file);
				return $books;
			}
		}
	}

	return null;
}
