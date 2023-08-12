import { getCompressionType } from './getCompressionType';

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

	return {
		compressionMethod: getCompressionType(view.getUint8(2))
	};
}
