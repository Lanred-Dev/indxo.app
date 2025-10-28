import "fastify";
import { SessionUser } from "../documents/User";

declare module "fastify" {
  interface FastifyRequest {
    user: SessionUser | null;
  }
}
