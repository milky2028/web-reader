import { derived, writable } from 'svelte/store';
import { browser } from '$app/environment';
import { extractPage } from './extractPage';
import { writeFile } from './writeFile';

const MANIFEST = 'book-manifest.json';

export type BookManifest = { name: string; path: string; pages: string[]; pageUrls: string[] };

async function writeManifest(manifest: Map<string, BookManifest>) {
	const { root } = await import('$lib/directories');

	const manifestFile = new File([JSON.stringify(Array.from(manifest))], MANIFEST);
	return writeFile(MANIFEST, await root, manifestFile);
}

async function getManifest() {
	try {
		const { root } = await import('$lib/directories');

		const rootDir = await root;
		const manifestHandle = await rootDir.getFileHandle(MANIFEST);
		const manifestFile = await manifestHandle.getFile();
		const manifestText = await manifestFile.text();

		return new Map(JSON.parse(manifestText)) as Map<string, BookManifest>;
	} catch {
		return new Map<string, BookManifest>();
	}
}

function createBookStore() {
	const { subscribe, update, set } = writable(new Map<string, BookManifest>());

	async function initialize() {
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

	async function createPage(
		pageNumber: number,
		bookName: string,
		$books: Map<string, BookManifest>
	) {
		const books = await extractPage(pageNumber, bookName, $books);
		if (books) {
			set(books);
		}
	}

	function add(bookName: string, manifest: BookManifest) {
		update((books) => {
			books.set(bookName, manifest);
			return new Map(books);
		});
	}

	return {
		subscribe,
		add,
		createPage,
		initialize
	};
}

export const books = createBookStore();
books.initialize();

export function getPage(pageNumber: number, bookName: string) {
	return derived(books, ($books) => {
		if (browser) {
			const page = $books.get(bookName)?.pageUrls[pageNumber];
			if (!page) {
				books.createPage(pageNumber, bookName, $books);
			}

			return page ?? '';
		}

		return '';
	});
}
