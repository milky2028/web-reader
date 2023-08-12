import { getCompressionType } from './getCompressionType';
import { getFileDataSignature } from './getFileData';
import { getLastModifiedDate } from './getLastModifiedDate';

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

	const compressionType = view.getUint8(2);
	const fileData = view.getUint8(3);
	const lastModifiedDate = view.getUint32(4, true);

	return {
		compressionMethod: getCompressionType(compressionType),
		lastModified: getLastModifiedDate(lastModifiedDate),
		...getFileDataSignature(fileData)
	};
}
