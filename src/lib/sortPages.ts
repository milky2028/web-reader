import type { FilesArrayObject } from './archive';

export function sortPages(fileA: FilesArrayObject, fileB: FilesArrayObject) {
	return fileA.file.name.localeCompare(fileB.file.name);
}
