export async function writeFile(name: string, directory: FileSystemDirectoryHandle, content: File) {
	const fileHandle = await directory.getFileHandle(name, { create: true });
	if ('createWritable' in fileHandle) {
		const writeStream = await fileHandle.createWritable();
		return content.stream().pipeTo(writeStream);
	}

	return Promise.resolve();
}
