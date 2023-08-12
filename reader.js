"use strict";
function getZipFileSignature(bytes) {
    const invalid = "File is not a valid zip archive.";
    if (bytes === undefined) {
        throw new Error(invalid);
    }
    const view = new DataView(bytes.buffer);
    const firstByte = view.getUint8(0);
    const secondByte = view.getUint8(1);
    if (firstByte !== 31 || secondByte !== 139) {
        throw new Error(invalid);
    }
    const compressionMethod = view.getUint8(2) === 8 ? "deflate" : "unknown";
    return {
        compressionMethod,
    };
}
const input = document.querySelector("input");
input?.addEventListener("change", async (event) => {
    const file = event.target?.files?.[0];
    const stream = file.stream();
    const { value: firstChunkData } = await stream.getReader().read();
    console.log(getZipFileSignature(firstChunkData));
});
