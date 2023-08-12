const decoder = new TextDecoder();

export function getTextFromBytes(bytes: Uint8Array, end: number) {
	return decoder.decode(bytes.slice(0, end));
}
