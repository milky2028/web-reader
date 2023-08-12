const ZIP_FIRST_BYTE = 31;
const ZIP_SECOND_BYTE = 139;

function getZipFileSignature(bytes: Uint8Array | undefined) {
  const invalid = "File is not a valid zip archive.";

  if (bytes === undefined) {
    throw new Error(invalid);
  }

  const view = new DataView(bytes.buffer);

  const firstByte = view.getUint8(0);
  const secondByte = view.getUint8(1);

  if (firstByte !== ZIP_FIRST_BYTE || secondByte !== ZIP_SECOND_BYTE) {
    throw new Error(invalid);
  }

  return {
    compressionMethod: view.getUint8(2) === 8 ? "deflate" : "unknown",
  };
}

const input = document.querySelector("input");
input?.addEventListener("change", async (event) => {
  const file = (event.target as HTMLInputElement)?.files?.[0] as File;
  const stream = file.stream();

  const { value: firstChunkData } = await stream.getReader().read();
  console.log(getZipFileSignature(firstChunkData));
});
