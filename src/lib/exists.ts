import type { Kind } from './directories';

export async function exists(name: string, kind: Kind, directory: FileSystemDirectoryHandle) {
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
