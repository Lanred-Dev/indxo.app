import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import Fastify from "fastify";
import { hook as authHook } from "./auth";
import deleteRoute from "./routes/delete";
import getRoute from "./routes/get";
import indexRoute from "./routes/index";
import uploadRoute from "./routes/upload";

const app = Fastify();

app.register(cookie);
app.register(multipart);
app.register(cors, {
    origin: process.env.ORIGIN!.split(","),
    credentials: true,
    methods: ["GET", "POST", "DELETE"],
});

app.decorateRequest("user", null);

app.addHook("onRequest", authHook);

app.route(indexRoute);
app.route(uploadRoute);
app.route(getRoute);
app.route(deleteRoute);

app.listen({ port: parseInt(process.env.PORT!), host: "0.0.0.0" }, function (error) {
    if (error) {
        app.log.error(error);
        process.exit(1);
    }

    app.log.info("Server started.");
});
