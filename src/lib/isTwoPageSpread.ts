import { browser } from '$app/environment';

export function isTwoPageSpread(url: string) {
	return new Promise<boolean>((resolve) => {
		if (browser) {
			const img = new Image();
			img.src = url;
			img.onload = () => {
				resolve(img.naturalWidth > img.naturalHeight);
			};
		}
	});
}
