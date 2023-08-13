await navigator.storage.persist();

type DirectoryIteratorResult = [string, FileSystemDirectoryHandle | FileSystemFileHandle];
export type Kind = 'directory' | 'file';

export type IterableDirectory = FileSystemDirectoryHandle & {
	[Symbol.asyncIterator](): AsyncIterator<DirectoryIteratorResult>;
};

const root = await navigator.storage.getDirectory();

export const covers = (await root.getDirectoryHandle('covers', {
	create: true
})) as IterableDirectory;

export const books = (await root.getDirectoryHandle('books', {
	create: true
})) as IterableDirectory;

export const settings = (await root.getDirectoryHandle('settings', {
	create: true
})) as IterableDirectory;
