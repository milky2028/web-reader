import { getCompressionType } from './getCompressionType';
import { getExtraDataInfo } from './getExtraDataInfo';
import { whatDataFollowsSignature } from './whatDataFollowsSignature';
import { getLastModifiedDate } from './getLastModifiedDate';
import { getOperatingSystem } from './getOperatingSystem';
import { getEndOfExtraData } from './getEndOfExtraData';
import { hasExtraData } from './hasExtraData';
import { INVALID_ZIP } from './invalidZip';
import { ARCHIVE_SIGNATURE_LENGTH } from './arrchiveSignatureLength';

const ZIP_FIRST_BYTE = 31;
const ZIP_SECOND_BYTE = 139;

export function getArchiveSignature(bytes: Uint8Array) {
	const view = new DataView(bytes.buffer);

	const firstByte = view.getUint8(0);
	const secondByte = view.getUint8(1);

	if (firstByte !== ZIP_FIRST_BYTE || secondByte !== ZIP_SECOND_BYTE) {
		throw new Error(INVALID_ZIP);
	}

	const compressionType = view.getUint8(2);
	const fileData = view.getUint8(3);
	const lastModifiedDate = view.getUint32(4, true);
	const compressionLevel = view.getUint8(8);
	const operatingSystem = view.getUint8(9);

	const fileDataSignature = whatDataFollowsSignature(fileData);
	const endOfExtraData = hasExtraData(fileDataSignature)
		? getEndOfExtraData(bytes)
		: ARCHIVE_SIGNATURE_LENGTH;

	return {
		compressionMethod: getCompressionType(compressionType),
		lastModified: getLastModifiedDate(lastModifiedDate),
		...getExtraDataInfo(fileDataSignature, bytes, endOfExtraData),
		compressionLevel,
		operatingSystem: getOperatingSystem(operatingSystem),
		endOfExtraData
	};
}
