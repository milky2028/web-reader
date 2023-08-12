<script lang="ts">
	async function onChange(event: Event & { currentTarget: HTMLInputElement }) {
		const { Archive } = await import('libarchive.js');
		const { default: workerUrl } = await import('$lib/assets/worker-bundle.js?url');

		Archive.init({ workerUrl });

		const files = (event.target as HTMLInputElement)?.files ?? [];
		for (const file of files) {
			const archive = await Archive.open(file);
			const obj = await archive.getFilesObject();
			console.log(obj);
		}
	}
</script>

<input on:change={onChange} type="file" accept=".cbr, .rar" multiple />
