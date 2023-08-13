export async function writeFile(name: string, directory: FileSystemDirectoryHandle, content: File) {
	const fileHandle = await directory.getFileHandle(name, { create: true });
	const writeStream = await fileHandle.createWritable();
	return content.stream().pipeTo(writeStream);
}
