import { Archive as libarchive } from 'libarchive.js';
import workerUrl from '$lib/assets/worker-bundle.js?url';

libarchive.init({ workerUrl });

export const Archive = libarchive;
