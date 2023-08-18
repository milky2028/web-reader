/// <reference lib="WebWorker" />;

async function getDirectoryFromPath(
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

type WriteEvent = MessageEvent<{ path: string; content: File }>;

self.addEventListener('message', async ({ data: { path, content } }: WriteEvent) => {
	try {
		const root = await navigator.storage.getDirectory();
		const directory = await getDirectoryFromPath(path, root);
		const fileHandle = await directory.getFileHandle(content.name, { create: true });

		const writeHandle = await fileHandle.createSyncAccessHandle();
		const buffer = await content.arrayBuffer();
		writeHandle.write(buffer, { at: 0 });

		await writeHandle.close();
	} catch (e) {
		console.error(e);
	} finally {
		postMessage('complete');
	}
});
