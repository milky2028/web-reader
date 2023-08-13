export async function getPage(nameOrIndex: string | number, book: string) {
	const { books } = await import('$lib/directories');
	const { Archive } = await import('$lib/archive');
	const { exists } = await import('./exists');
	const { getFile } = await import('./getFile');
	const { getManifest } = await import('./manifest');

	const bookHandle = await books.getDirectoryHandle(book);

	let pageToGet = typeof nameOrIndex === 'string' ? nameOrIndex : '';
	if (typeof nameOrIndex === 'number') {
		const manifest = await getManifest(bookHandle);
		pageToGet = manifest.pages[nameOrIndex];
	}

	if (await exists(pageToGet, 'file', bookHandle)) {
		return getFile(pageToGet, bookHandle);
	}

	const archiveFile = await getFile(book, bookHandle);
	const archive = await Archive.open(archiveFile);
	return archive.extractSingleFile(pageToGet);
}
