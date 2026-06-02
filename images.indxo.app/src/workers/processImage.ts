import heicConvert from "heic-convert";
import sharp from "sharp";

interface WorkerPayload {
    buffer: Uint8Array;
    filepath: string;
    fileType: string;
}

export default async function processImage({ buffer, filepath, fileType }: WorkerPayload) {
    let imageBuffer = Buffer.from(buffer);

    if (fileType === "heic" || fileType === "heif") {
        const inputArrayBuffer = imageBuffer.buffer.slice(
            imageBuffer.byteOffset,
            imageBuffer.byteOffset + imageBuffer.byteLength
        );
        const converted = await heicConvert({
            buffer: inputArrayBuffer,
            format: "JPEG",
            quality: 1,
        });
        imageBuffer = Buffer.from(converted);
    }

    await sharp(imageBuffer).webp({ quality: 50 }).toFile(filepath);
    return true;
}
