import { ARCHIVE_SIGNATURE_LENGTH } from './arrchiveSignatureLength';

export function getEndOfExtraData(bytes: Uint8Array) {
	return bytes.slice(ARCHIVE_SIGNATURE_LENGTH).findIndex((byte) => byte === 0);
}
