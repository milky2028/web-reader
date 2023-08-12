export function convertNumberToBinary(uint8: number): string {
	if (uint8 < 0 || uint8 > 255) {
		throw new Error('Number is not a valid byte.');
	}

	return uint8.toString(2);
}
