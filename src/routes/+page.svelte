<script lang="ts">
	import { getArchiveSignature } from '$lib/getArchiveSignature';
	import { getLocalFileSignature } from '$lib/getLocalFileSignature';
	import { INVALID_ZIP } from '$lib/invalidZip';

	async function onChange(event: Event & { currentTarget: HTMLInputElement }) {
		const files = event.currentTarget.files ?? [];
		for (const file of files) {
			const [forArchiveSignature, forDecompression] = file.stream().tee();

			const { value: firstChunk } = await forArchiveSignature.getReader().read();
			if (!firstChunk) {
				throw new Error(INVALID_ZIP);
			}

			const archiveSignature = getArchiveSignature(firstChunk);
			const firstLocalFileSignature = getLocalFileSignature(
				archiveSignature.endOfExtraData,
				firstChunk
			);

			console.log(archiveSignature);
			console.log(firstLocalFileSignature);
		}
	}
</script>

<input on:change={onChange} type="file" accept=".cbz, .gz" multiple />
