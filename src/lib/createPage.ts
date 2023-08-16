import type { BookManifest } from './bookStore';
import { writeFile } from './writeFile';

export async function createPage(
	pageNumber: number,
	bookName: string,
	books: Map<string, BookManifest>
) {
	const { booksDirectory } = await import('$lib/directories');
	const { Archive } = await import('$lib/archive');
	const { exists } = await import('./exists');
	const { getFile } = await import('./getFile');

	const bookHandle = await booksDirectory.getDirectoryHandle(bookName);
	const book = books.get(bookName);
	const url = book?.pageUrls[pageNumber];

	if (book) {
		if (url) {
			return url;
		}

		if (await exists(`${pageNumber}`, bookHandle)) {
			const file = await getFile(`${pageNumber}`, bookHandle);

			return URL.createObjectURL(file);
		}

		const archiveFile = await getFile(bookName, bookHandle);
		const archive = await Archive.open(archiveFile);

		const pageFileName = books.get(bookName)?.pages[pageNumber];
		if (pageFileName) {
			const file = await archive.extractSingleFile(pageFileName);

			writeFile(`${pageNumber}`, bookHandle, file);
			return URL.createObjectURL(file);
		}
	}

	return '';
}
