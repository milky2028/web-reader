export function getOperatingSystem(uint32: number) {
	switch (uint32) {
		case 0:
		case 10:
			return 'Windows';
		case 3:
		case 7:
		case 19:
			return 'MacOS';

		default:
			return 'unknown';
	}
}
