import { binaryStringToBoolean } from './binaryStringToBoolean';
import { convertNumberToBinary } from './convertNumberToBinary';

// 1) ftext - is the file text
// 2) fhcrc - has crc16
// 3) fextra - indicates the presence of extra data
// 4) fname - the original file name is present
// 5) fcomment - comment field is present

export function getFileDataSignature(uint8: number) {
	const fileData = convertNumberToBinary(uint8);

	return {
		hasFileText: binaryStringToBoolean(fileData[0]),
		hasFileHcrc: binaryStringToBoolean(fileData[1]),
		hasExtraFileData: binaryStringToBoolean(fileData[2]),
		hasFileName: binaryStringToBoolean(fileData[3]),
		hasFileComments: binaryStringToBoolean(fileData[4])
	};
}
