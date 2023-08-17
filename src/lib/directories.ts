type DirectoryIteratorResult = [string, FileSystemDirectoryHandle | FileSystemFileHandle];
export type Kind = 'directory' | 'file';

export type IterableDirectory = FileSystemDirectoryHandle & {
	[Symbol.asyncIterator](): AsyncIterator<DirectoryIteratorResult>;
};

export const root = navigator.storage.getDirectory();

export const booksDirectory = root.then((directory) =>
	directory.getDirectoryHandle('books', {
		create: true
	})
);
