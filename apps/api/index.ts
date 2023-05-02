import Fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import prismaPlugin from "./plugins/prisma";
import { PrismaClient } from "@prisma/client";
const server: FastifyInstance = Fastify({});
import staffRoute from "./routes/staff";

server.register(prismaPlugin);
server.register(staffRoute, { prefix: "staff" });

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          pong: {
            type: "string",
          },
        },
      },
    },
  },
};

server.get("/ping", opts, async (request, reply) => {
  return { pong: "it worked!" };
});

const start = async () => {
  try {
    await server.listen({ host: "localhost", port: 8080 });

    const address = server.server.address();
    const port = typeof address === "string" ? address : address?.port;
    console.log(`Server running at http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    console.log(err);
    // process.exit(1);
  }
};
start();
