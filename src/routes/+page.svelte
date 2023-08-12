<script lang="ts">
	import { getArchiveSignature } from '$lib/getArchiveSignature';
	import { getLastChunk } from '$lib/getLastChunk';

	async function onChange(event: Event & { currentTarget: HTMLInputElement }) {
		const files = event.currentTarget.files ?? [];
		for (const file of files) {
			const [forArchiveSignature, forDecompression] = file.stream().tee();

			const { value: firstChunk } = await forArchiveSignature.getReader().read();
			console.log(getArchiveSignature(firstChunk));
		}
	}
</script>

<input on:change={onChange} type="file" accept=".cbz, .gz" multiple />
