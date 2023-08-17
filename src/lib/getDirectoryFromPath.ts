export async function getDirectoryFromPath(
	path: string,
	root: FileSystemDirectoryHandle
): Promise<FileSystemDirectoryHandle> {
	const parts = path.split('/').filter((part) => part !== '');
	parts.shift();

	let handle = root;
	for (const part of parts) {
		handle = await handle.getDirectoryHandle(part, { create: true });
	}

	return handle;
}
