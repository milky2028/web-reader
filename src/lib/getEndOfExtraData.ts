import { ARCHIVE_SIGNATURE_LENGTH } from './arrchiveSignatureLength';

export function getEndOfExtraData(bytes: Uint8Array) {
	for (let i = ARCHIVE_SIGNATURE_LENGTH; i < bytes.length; i++) {
		if (bytes[i] === 0) {
			return i;
		}
	}

	return 0;
}
