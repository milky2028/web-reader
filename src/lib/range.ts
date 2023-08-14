type RangeParams = { start?: number; length: number; step?: number };

export function range({ start = 0, length, step = 1 }: RangeParams) {
	const numbers = [];
	for (let i = start; i < length; i += step) {
		numbers.push(i);
	}

	return numbers;
}
