import cookie from "@fastify/cookie";
import multipart from "@fastify/multipart";
import Fastify from "fastify";
import { hook as authHook } from "./auth";
import getRoute from "./routes/get";
import uploadRoute from "./routes/upload";

const app = Fastify();

app.register(cookie);
app.register(multipart);

app.decorateRequest("user", null);

app.addHook("onRequest", authHook);

app.route(uploadRoute);
app.route(getRoute);

app.listen({ port: parseInt(process.env.PORT!) }, function (error) {
    if (error) {
        app.log.error(error);
        process.exit(1);
    }

    app.log.info("Server started.");
});
