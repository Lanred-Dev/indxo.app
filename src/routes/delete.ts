import { RouteOptions } from "fastify";
import { unlink } from "fs/promises";
import path from "path";
import { ResponseCodes, ResponseMessages } from "../utils/apiResponses";

const MAX_FILE_SIZE: number = parseInt(process.env.MAX_FILE_SIZE!);
const ALLOWED_FILE_TYPES: string[] = process.env.ALLOWED_FILE_TYPES!.split(",");
const UPLOAD_DIRECTORY: string = process.env.UPLOAD_DIRECTORY!;

export const route: RouteOptions = {
    method: "DELETE",
    url: "/delete/:filename",
    handler: async (request, reply) => {
        if (!request.user)
            return reply
                .code(ResponseCodes.Unauthorized)
                .send(new Error(ResponseMessages.Unauthorized));

        const { filename } = request.params as {
            filename: string;
        };

        try {
            const filepath = path.join(UPLOAD_DIRECTORY, path.basename(filename));
            await unlink(filepath);
            return reply.code(ResponseCodes.SuccessNoResponse).send();
        } catch {
            return reply
                .code(ResponseCodes.NotFound)
                .send(new Error("Failed to delete image or image does not exist"));
        }
    },
};

export default route;
