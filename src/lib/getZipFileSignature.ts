import { getCompressionType } from './getCompressionType';
import { getFileDataSignature } from './getFileData';
import { getLastModifiedDate } from './getLastModifiedDate';
import { getOperatingSystem } from './getOperatingSystem';

const ZIP_FIRST_BYTE = 31;
const ZIP_SECOND_BYTE = 139;

const INVALID_ZIP = 'File is not a valid zip archive.';

export function getZipFileSignature(bytes: Uint8Array | undefined) {
	if (bytes === undefined) {
		throw new Error(INVALID_ZIP);
	}

	const view = new DataView(bytes.buffer);

	const firstByte = view.getUint8(0);
	const secondByte = view.getUint8(1);

	if (firstByte !== ZIP_FIRST_BYTE || secondByte !== ZIP_SECOND_BYTE) {
		throw new Error(INVALID_ZIP);
	}

	const fileHeader = bytes.slice(0, 10);
	console.log('initial signature', fileHeader);

	const compressionType = view.getUint8(2);
	const fileData = view.getUint8(3);
	const lastModifiedDate = view.getUint32(4, true);
	const compressionLevel = view.getUint8(8);
	const operatingSystem = view.getUint8(9);

	return {
		compressionMethod: getCompressionType(compressionType),
		lastModified: getLastModifiedDate(lastModifiedDate),
		...getFileDataSignature(fileData),
		compressionLevel,
		operatingSystem: getOperatingSystem(operatingSystem)
	};
}
