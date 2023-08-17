export function decodeImage(url: string) {
	if (url) {
		const img = new Image();
		img.src = url;
		return img.decode();
	}

	return Promise.resolve();
}
