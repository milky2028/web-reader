export const MANIFEST = 'book-manifest.json';

export type BookManifest = { cover: string; pages: string[]; pageUrls: string[] };

export async function writeManifest(
	manifest: BookManifest,
	bookDirectory: FileSystemDirectoryHandle
) {
	const { writeFile } = await import('./writeFile');

	const manifestFile = new File([JSON.stringify(manifest)], MANIFEST);
	return writeFile(MANIFEST, bookDirectory, manifestFile);
}

export async function getManifest(bookName: string) {
	const { books } = await import('$lib/directories');

	const bookDirectory = await books.getDirectoryHandle(bookName);
	const manifestHandle = await bookDirectory.getFileHandle(MANIFEST);
	const manifestFile = await manifestHandle.getFile();
	const manifestText = await manifestFile.text();

	return JSON.parse(manifestText) as BookManifest;
}
