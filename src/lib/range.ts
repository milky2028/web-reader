type RangeParams = { start?: number; length: number; step?: number };

export function range({ start = 0, length }: RangeParams) {
	const numbers = [];
	for (let i = start; i < start + length; i++) {
		numbers.push(i);
	}

	return numbers;
}
