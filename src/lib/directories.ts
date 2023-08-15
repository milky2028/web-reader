await navigator.storage.persist();

type DirectoryIteratorResult = [string, FileSystemDirectoryHandle | FileSystemFileHandle];
export type Kind = 'directory' | 'file';

export type IterableDirectory = FileSystemDirectoryHandle & {
	[Symbol.asyncIterator](): AsyncIterator<DirectoryIteratorResult>;
};

export const root = await navigator.storage.getDirectory();

export const booksDirectory = (await root.getDirectoryHandle('books', {
	create: true
})) as IterableDirectory;
