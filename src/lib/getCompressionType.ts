export function getCompressionType(type: number) {
	return type === 8 ? 'deflate' : 'unknown';
}
