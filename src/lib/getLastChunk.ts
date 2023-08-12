export async function getLastChunk(stream: ReadableStream<Uint8Array>) {
	let done = false;
	let value = undefined;
	const reader = stream.getReader();

	while (!done) {
		const chunk = await reader.read();
		({ done } = chunk);

		if (chunk.done) {
			return value;
		} else {
			value = chunk.value;
		}
	}
}
