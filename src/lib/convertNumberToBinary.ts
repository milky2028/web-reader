export function convertNumberToBinary(num: number): string {
	if (num < 0 || num > 255) {
		throw new Error('Number is not a valid byte.');
	}

	return num.toString(2);
}
