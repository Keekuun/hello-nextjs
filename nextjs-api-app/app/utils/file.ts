// ArrayBuffer to Blob URL
export const arrayBufferToBlob = (buffer: ArrayBuffer, type: string): Blob => {
  return new Blob([buffer], { type });
}

export const blobToUrl = (blob: Blob): string => {
  return URL.createObjectURL(blob);
}

export const arrayBufferToBlobUrl = (buffer: ArrayBuffer, type: string): string => {
  return blobToUrl(arrayBufferToBlob(buffer, type));
}