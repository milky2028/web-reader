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

	console.log(book);

	if (book) {
		if (url) {
			return { url, books };
		}

		if (await exists(`${pageNumber}`, bookHandle)) {
			const file = await getFile(`${pageNumber}`, bookHandle);

			const url = URL.createObjectURL(file);
			book.pageUrls[pageNumber] = url;
			return { url, books };
		}

		const archiveFile = await getFile(bookName, bookHandle);
		const archive = await Archive.open(archiveFile);

		const pageFileName = books.get(bookName)?.pages[pageNumber];
		if (pageFileName) {
			const file = await archive.extractSingleFile(pageFileName);

			writeFile(`${pageNumber}`, bookHandle, file);
			const url = URL.createObjectURL(file);
			book.pageUrls[pageNumber] = url;
			return { url, books };
		}
	}

	return { url: '', books };
}
