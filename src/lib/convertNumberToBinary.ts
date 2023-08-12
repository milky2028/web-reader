export function convertNumberToBinary(uint8: number) {
	if (uint8 < 0 || uint8 > 255) {
		throw new Error('Number is not a valid byte.');
	}

	const binary = uint8.toString(2);
	return '00000000'.substr(binary.length) + binary;
}
