import { RouteOptions } from "fastify";
import { fileTypeFromBuffer } from "file-type";
import path from "path";
import sharp from "sharp";
import { ResponseCodes, ResponseMessages } from "../utils/apiResponses";
import generateDocumentID from "../utils/generateID";

const MAX_FILE_SIZE: number = parseInt(process.env.MAX_FILE_SIZE!);
const ALLOWED_FILE_TYPES: string[] = process.env.ALLOWED_FILE_TYPES!.split(",");
const UPLOAD_DIRECTORY: string = process.env.UPLOAD_DIRECTORY!;

export const route: RouteOptions = {
    method: "POST",
    url: "/upload",
    handler: async (request, reply) => {
        if (!request.user)
            return reply
                .code(ResponseCodes.Unauthorized)
                .send(new Error(ResponseMessages.Unauthorized));

        const data = await request.file();

        if (!data) return reply.code(ResponseCodes.BadRequest).send(new Error("No image provided"));

        const buffer = await data.toBuffer();
        const fileType = await fileTypeFromBuffer(buffer);

        if (!fileType || !ALLOWED_FILE_TYPES.includes(fileType.ext.toLowerCase())) {
            return reply
                .code(ResponseCodes.InvalidMediaType)
                .send(new Error(`Allowed file types are ${ALLOWED_FILE_TYPES.join(", ")}`));
        }

        const sizeInMB: number = buffer.length / (1024 * 1024);

        if (sizeInMB > MAX_FILE_SIZE)
            return reply
                .code(ResponseCodes.ContentTooLarge)
                .send(new Error(`Max file size is ${MAX_FILE_SIZE}MB`));

        try {
            const filename: string = `${request.user._id}-${generateDocumentID(15)}.webp`;
            const filepath = path.join(UPLOAD_DIRECTORY, path.basename(filename));
            await sharp(buffer).webp({ quality: 50 }).toFile(filepath);
            return reply.send(filename);
        } catch (_error) {
            return reply.code(ResponseCodes.ServerError).send(new Error("Failed to save image"));
        }
    },
};

export default route;
