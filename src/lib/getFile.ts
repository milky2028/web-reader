export async function getFile(name: string, directory: FileSystemDirectoryHandle) {
	const fileHandle = await directory.getFileHandle(name);
	return fileHandle.getFile();
}
