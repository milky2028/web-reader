import { writable } from 'svelte/store';
import { browser } from '$app/environment';
export const MANIFEST = 'book-manifest.json';

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

	function add(bookName: string, manifest: BookManifest) {
		update((books) => {
			const updatedBooks = books.set(bookName, manifest);
			writeManifest(books);

			return new Map(updatedBooks);
		});
	}

	type AddPageUrlsParams = {
		bookName: string;
		urls: string[];
	};

	function addPageUrls(...updates: AddPageUrlsParams[]) {
		update((books) => {
			for (const { bookName, urls } of updates) {
				const book = books.get(bookName);
				if (book) {
					book.pageUrls = [...book.pageUrls, ...urls];
				}
			}

			return books;
		});
	}

	return {
		subscribe,
		intialize,
		add,
		addPageUrls
	};
}

export const books = createBookStore();
