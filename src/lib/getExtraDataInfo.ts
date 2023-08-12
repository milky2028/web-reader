import type { whatDataFollowsSignature } from './whatDataFollowsSignature';
import { getTextFromBytes } from './getTextFromBytes';

export function getExtraDataInfo(
	info: ReturnType<typeof whatDataFollowsSignature>,
	bytes: Uint8Array,
	endOfExtraData: number
) {
	return Object.fromEntries(
		info.map(([key, value]) => [key, value ? getTextFromBytes(bytes, endOfExtraData) : ''])
	);
}
