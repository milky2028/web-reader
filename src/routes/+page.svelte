<script lang="ts">
	let pageUrls: string[] = [];

	async function onChange(event: Event & { currentTarget: HTMLInputElement }) {
		const { Archive } = await import('libarchive.js');
		const { default: workerUrl } = await import('$lib/assets/worker-bundle.js?url');

		Archive.init({ workerUrl });

		const files = (event.target as HTMLInputElement)?.files ?? [];
		for (const file of files) {
			const archive = await Archive.open(file);
			const archivedFiles = await archive.extractFiles();

			const archiveImages = Object.values(archivedFiles).map((archiveFile) => {
				if (archiveFile instanceof File) {
					return URL.createObjectURL(archiveFile);
				}

				return '';
			});

			pageUrls = await Promise.all(archiveImages);
		}
	}
</script>

<input on:change={onChange} type="file" accept=".cbr, .rar, .cbz, .zip" multiple />
{#each pageUrls as url}
	{#if url}
		<img src={url} loading="lazy" alt="" width="100" />
	{/if}
{/each}
