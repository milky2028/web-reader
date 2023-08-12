import type { whatDataFollowsSignature } from './whatDataFollowsSignature';

export function hasExtraData(info: ReturnType<typeof whatDataFollowsSignature>) {
	for (const [, value] of info) {
		if (value) {
			return true;
		}
	}

	return false;
}
