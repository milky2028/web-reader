await navigator.storage.persist();

const root = await navigator.storage.getDirectory();

export const covers = await root.getDirectoryHandle('covers', { create: true });
export const books = await root.getDirectoryHandle('books', { create: true });
export const settings = await root.getDirectoryHandle('settings', { create: true });
