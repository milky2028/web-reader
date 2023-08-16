import type { BookManifest } from './bookStore';
import { createPage } from './createPage';

export function getPageUrl(pageNumber: number, bookName: string, books: Map<string, BookManifest>) {
	const page = books.get(bookName)?.pageUrls[pageNumber];
	if (!page) {
		return createPage(pageNumber, bookName, books);
	}

	return Promise.resolve(page);
}
