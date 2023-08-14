import { getPage } from './getPage';
import { range } from './range';
import { writeFile } from './writeFile';

const NUMBER_OF_PAGES_TO_CACHE = 6;
export async function cachePages(start: number, book: string) {
	const { books } = await import('$lib/directories');
	const { getManifest } = await import('$lib/manifest');

	const bookHandle = await books.getDirectoryHandle(book);
	const { pages } = await getManifest(book);

	const process = range({ start, length: NUMBER_OF_PAGES_TO_CACHE, max: pages.length }).map(
		async (index) => {
			const page = await getPage(index, book);
			return writeFile(pages[index], bookHandle, page);
		}
	);

	return Promise.all(process);
}
