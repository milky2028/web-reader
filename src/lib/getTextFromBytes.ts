const decoder = new TextDecoder();

export function getTextFromBytes(bytes: Uint8Array, start: number, end: number) {
	return decoder.decode(bytes.slice(start, end));
}
