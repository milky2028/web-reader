type RangeParams = { start?: number; length: number; step?: number; max?: number };

export function range({ start = 0, length, step = 1, max = start + length }: RangeParams) {
	const numbers = [];

	for (let i = start; i < start + length && i < max; i += step) {
		numbers.push(i);
	}

	return numbers;
}
