import { RouteOptions } from "fastify";
import { fileTypeFromBuffer } from "file-type";
import fs from "fs";
import path from "path";
import { ResponseCodes } from "../utils/apiResponses";
import generateDocumentID from "../utils/generateID";
import Piscina from "piscina";

const MAX_FILE_SIZE: number = parseInt(process.env.MAX_FILE_SIZE!);
const ALLOWED_FILE_TYPES: string[] = process.env.ALLOWED_FILE_TYPES!.split(",");
const UPLOAD_DIRECTORY: string = path.join(".", process.env.UPLOAD_DIRECTORY!);

if (!fs.existsSync(UPLOAD_DIRECTORY)) fs.mkdirSync(UPLOAD_DIRECTORY, { recursive: true });

const piscina = new Piscina({
    filename: path.resolve(__dirname, "../workers/processImage.js"),
});

export const route: RouteOptions = {
    method: "POST",
    url: "/upload",
    handler: async (request, reply) => {
        if (!request.user)
            return reply
                .code(ResponseCodes.Unauthorized)
                .send(new Error("You do not have permission to upload files."));

        const data = await request.file();

        if (!data) return reply.code(ResponseCodes.BadRequest).send(new Error("No file provided."));

        const buffer = await data.toBuffer();
        const fileType = await fileTypeFromBuffer(buffer);

        if (!fileType || !ALLOWED_FILE_TYPES.includes(fileType.ext.toLowerCase())) {
            return reply
                .code(ResponseCodes.InvalidMediaType)
                .send(new Error(`Allowed file types are ${ALLOWED_FILE_TYPES.join(", ")}.`));
        }

        const sizeInMB: number = buffer.length / (1024 * 1024);

        if (sizeInMB > MAX_FILE_SIZE)
            return reply
                .code(ResponseCodes.ContentTooLarge)
                .send(new Error(`Max file size is ${MAX_FILE_SIZE}MB.`));

        try {
            const filename: string = `${request.user._id}-${generateDocumentID(15)}.webp`;
            const filepath: string = path.join(UPLOAD_DIRECTORY, path.basename(filename));

            await piscina.run({
                buffer: new Uint8Array(buffer),
                filepath,
                fileType: fileType.ext.toLowerCase(),
            });

            return reply.send(filename);
        } catch {
            return reply
                .code(ResponseCodes.ServerError)
                .send(new Error("Failed to process image file."));
        }
    },
};

export default route;
