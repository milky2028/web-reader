import { derived, get, writable } from 'svelte/store';
import { browser } from '$app/environment';
import { writeFile } from './writeFile';
import { range } from './range';

const MANIFEST = 'book-manifest.json';

export type BookManifest = { name: string; pages: string[]; pageUrls: string[] };

async function writeManifest(manifest: Map<string, BookManifest>) {
	const { writeFile } = await import('./writeFile');
	const { root } = await import('$lib/directories');

	const manifestFile = new File([JSON.stringify(Array.from(manifest))], MANIFEST);
	return writeFile(MANIFEST, root, manifestFile);
}

async function getManifest() {
	try {
		const { root } = await import('$lib/directories');

		const manifestHandle = await root.getFileHandle(MANIFEST);
		const manifestFile = await manifestHandle.getFile();
		const manifestText = await manifestFile.text();

		return new Map(JSON.parse(manifestText)) as Map<string, BookManifest>;
	} catch {
		return new Map<string, BookManifest>();
	}
}

function createBookStore() {
	const { subscribe, update, set } = writable(new Map<string, BookManifest>());

	async function intialize() {
		if (browser) {
			const manifest = await getManifest();

			set(manifest);
			subscribe((manifest) => {
				if (browser && manifest.size > 0) {
					const manifestWithoutUrls = new Map(
						[...manifest.entries()].map(([bookName, bookManifest]) => {
							return [bookName, { ...bookManifest, pageUrls: [] }];
						})
					);

					writeManifest(manifestWithoutUrls);
				}
			});
		}
	}

	function add(bookName: string, manifest: BookManifest) {
		update((books) => {
			books.set(bookName, manifest);
			return new Map(books);
		});
	}

	async function createPage(pageNumber: number, bookName: string) {
		const { booksDirectory } = await import('$lib/directories');
		const { Archive } = await import('$lib/archive');
		const { exists } = await import('./exists');
		const { getFile } = await import('./getFile');

		const $books = get(books);

		const bookHandle = await booksDirectory.getDirectoryHandle(bookName);
		const book = $books.get(bookName);
		const url = book?.pageUrls[pageNumber];

		if (book) {
			if (!url) {
				if (await exists(`${pageNumber}`, bookHandle)) {
					const file = await getFile(`${pageNumber}`, bookHandle);
					book.pageUrls[pageNumber] = URL.createObjectURL(file);

					return set($books);
				}

				const archiveFile = await getFile(bookName, bookHandle);
				const archive = await Archive.open(archiveFile);

				const pageFileName = $books.get(bookName)?.pages[pageNumber];
				if (pageFileName) {
					const file = await archive.extractSingleFile(pageFileName);
					book.pageUrls[pageNumber] = URL.createObjectURL(file);

					await writeFile(`${pageNumber}`, bookHandle, file);
					return set($books);
				}
			}
		}
	}

	const NUMBER_OF_PAGES_TO_CACHE = 10;
	function cachePages(start: number, bookName: string) {
		const $books = get(books);
		const book = $books.get(bookName);
		const processPages = range({
			start,
			length: NUMBER_OF_PAGES_TO_CACHE,
			max: book?.pages.length ?? 0
		}).map((index) => createPage(index, bookName));

		return Promise.all(processPages);
	}

	return {
		subscribe,
		intialize,
		add,
		createPage,
		cachePages
	};
}

export const books = createBookStore();

export function getPage(pageNumber: number, bookName: string) {
	return derived(books, ($books) => {
		if (browser) {
			const page = $books.get(bookName)?.pageUrls[pageNumber];
			if (!page) {
				books.createPage(pageNumber, bookName);
			}

			return page ?? '';
		}

		return '';
	});
}
