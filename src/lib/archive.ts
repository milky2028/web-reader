import { Archive as libarchive } from 'libarchive.js';
import workerUrl from '$lib/assets/worker-bundle.js?url';
import { CompressedFile as libarchiveCompressedFile } from 'libarchive.js/src/compressed-file';

libarchive.init({ workerUrl });

export const CompressedFile = libarchiveCompressedFile;
export const Archive = libarchive;
