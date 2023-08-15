import { getPage } from './getPage';
import { range } from './range';

const NUMBER_OF_PAGES_TO_CACHE = 6;
export async function cachePages(start: number, book: string) {
	const { getManifest } = await import('$lib/manifest');
	const { pages } = await getManifest(book);

	const processPages = range({ start, length: NUMBER_OF_PAGES_TO_CACHE, max: pages.length }).map(
		(index) => getPage(index, book)
	);

	return Promise.all(processPages);
}
