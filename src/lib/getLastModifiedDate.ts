export function getLastModifiedDate(uint32: number) {
	return new Date(uint32 * 1_000);
}
