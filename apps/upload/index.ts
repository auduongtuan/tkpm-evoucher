import Fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
// import { Server, IncomingMessage, ServerResponse } from "http";

import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import uploadRoute from "./routes/upload";
import fastifyStatic from "@fastify/static";
import path from "path";
import { getApiUrl } from "helpers/server";
const server: FastifyInstance =
  Fastify().withTypeProvider<TypeBoxTypeProvider>();
server.register(cors, {
  origin: ["*"],
});
server.register(multipart);
server.register(uploadRoute);
server.register(fastifyStatic, {
  root: path.join(__dirname, "uploads"),
  prefix: "/uploads/", // optional: default '/'
  // constraints: { host: 'example.com' } // optional: default {}
});
const start = async () => {
  try {
    await server.listen({ host: "localhost", port: 8180 });
    // const address = server.server.address();
    // const port = typeof address === "string" ? address : address?.port;
    console.log(`Upload server running at ${getApiUrl(server)}`);
    console.log();
  } catch (err) {
    server.log.error(err);
    console.log(err);
    // process.exit(1);
  }
};
start();
