import { convertNumberToBinary } from './convertNumberToBinary';

// 1) ftext - is the file text
// 2) fhcrc - has crc16
// 3) fextra - indicates the presence of extra data
// 4) fname - the original file name is present
// 5) fcomment - comment field is present

export function whatDataFollowsSignature(uint8: number) {
	const fileData = convertNumberToBinary(uint8);

	return [
		['text', fileData === '00000001'],
		['crc', fileData === '00000010'],
		['extras', fileData === '00000100'],
		['fileName', fileData === '00001000'],
		['comments', fileData === '00010000']
	] as const;
}
