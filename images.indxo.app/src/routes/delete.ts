import { RouteOptions } from "fastify";
import { unlink } from "fs/promises";
import path from "path";
import { ResponseCodes } from "../utils/apiResponses";

const UPLOAD_DIRECTORY: string = process.env.UPLOAD_DIRECTORY!;

export const route: RouteOptions = {
    method: "DELETE",
    url: "/delete/:filename",
    handler: async (request, reply) => {
        if (!request.user)
            return reply
                .code(ResponseCodes.Unauthorized)
                .send(new Error("You do not have permission to delete this file."));

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
                .send(new Error("File not found or could not be deleted."));
        }
    },
};

export default route;
