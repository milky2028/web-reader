import { writable } from 'svelte/store';
export const MANIFEST = 'book-manifest.json';

export type BookManifest = { name: string; cover: string; pages: string[]; pageUrls: string[] };

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
	const books = new Map<string, BookManifest>();
	const { subscribe, update, set } = writable(books);

	async function intialize() {
		const manifest = await getManifest();
		set(manifest);
	}

	function get(bookName: string) {
		return books.get(bookName) as BookManifest;
	}

	function add(bookName: string, manifest: BookManifest) {
		update((books) => {
			const updatedBooks = books.set(bookName, manifest);
			writeManifest(books);

			console.log(books);
			return new Map(updatedBooks);
		});
	}

	function updateBook(bookName: string, newManifest: Partial<BookManifest>) {
		update((books) => {
			const currentBook = get(bookName);
			const updatedBook = { ...newManifest, ...currentBook };
			books.set(bookName, updatedBook);
			writeManifest(books);

			console.log(books);
			return new Map(books);
		});
	}

	return {
		subscribe,
		intialize,
		get,
		add,
		updateBook
	};
}

export const books = createBookStore();
