import { RouteOptions } from "fastify";
import { readFile } from "fs/promises";
import path from "path";
import { ResponseCodes } from "../utils/apiResponses";

const UPLOAD_DIRECTORY: string = process.env.UPLOAD_DIRECTORY!;

export const route: RouteOptions = {
    method: "GET",
    url: "/get/:filename",
    handler: async (request, reply) => {
        const { filename } = request.params as {
            filename: string;
        };

        try {
            const filepath = path.join(UPLOAD_DIRECTORY, path.basename(filename));
            const data = await readFile(filepath);
            return reply.send(data);
        } catch (_error) {
            return reply.code(ResponseCodes.NotFound).send(new Error("Image does not exist"));
        }
    },
    schema: {
        params: {
            type: "object",
            properties: {
                filename: { type: "string" },
            },
        },
    },
};

export default route;
