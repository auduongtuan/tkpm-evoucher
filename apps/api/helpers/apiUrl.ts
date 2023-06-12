import { FastifyInstance } from "fastify";
export function getApiUrl(fastify: FastifyInstance) {
  return fastify.listeningOrigin.replace("::1", "localhost");
}
