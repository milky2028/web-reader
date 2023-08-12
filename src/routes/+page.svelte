<script lang="ts">
	import { getArchiveSignature } from '$lib/getArchiveSignature';

	async function onChange(event: Event & { currentTarget: HTMLInputElement }) {
		const files = event.currentTarget.files ?? [];
		for (const file of files) {
			const stream = file.stream();

			const { value: firstChunkData } = await stream.getReader().read();
			console.log(getArchiveSignature(firstChunkData));
		}
	}
</script>

<input on:change={onChange} type="file" accept=".cbz, .gz" multiple />
