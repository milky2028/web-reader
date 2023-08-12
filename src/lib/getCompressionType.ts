export function getCompressionType(uint8: number) {
	return uint8 === 8 ? 'deflate' : 'unknown';
}
