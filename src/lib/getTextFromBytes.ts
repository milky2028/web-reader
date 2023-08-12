const decoder = new TextDecoder();

export function getTextFromBytes(bytes: Uint8Array) {
	const nullTerminator = bytes.findIndex((value) => value === 0);
	return decoder.decode(bytes.slice(0, nullTerminator));
}
