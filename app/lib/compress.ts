export const compressImage = async (file: File): Promise<File> => {
    const maxWidth = 1600; // Standard HD-ish width
    const quality = 0.7;   // 70% quality is usually indistinguishable but 1/10th the size

    // Create a bitmap to get dimensions
    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;

    // Scale down if it's a massive phone photo
    if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
    }

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context failed');

    ctx.drawImage(bitmap, 0, 0, width, height);

    // Convert to a compressed JPEG Blob
    const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality });

    // Return as a File object so the rest of your code doesn't have to change
    return new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
        type: 'image/jpeg',
    });
};