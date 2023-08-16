import type { Kind } from './directories';

export async function exists(
	name: string,
	directory: FileSystemDirectoryHandle,
	kind: Kind = 'file'
) {
	try {
		if (kind === 'directory') {
			await directory.getDirectoryHandle(name);
		} else {
			await directory.getFileHandle(name);
		}

		return true;
	} catch {
		return false;
	}
}
