import Fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
// import { Server, IncomingMessage, ServerResponse } from "http";
import prismaPlugin from "./plugins/prisma";
const server: FastifyInstance = Fastify({});
import staffRoute from "./routes/staffs";
import merchantRoute from "./routes/merchants";
import campainRoute from "./routes/campaigns";
import storeRoute from "./routes/stores";
import categoryRoute from "./routes/categories";
import gameRoute from "./routes/games";
import cors from "@fastify/cors";

server.register(cors, {
  origin: ["http://localhost:5173"],
});
server.register(prismaPlugin);
server.register(staffRoute, { prefix: "staffs" });
server.register(merchantRoute, { prefix: "merchants" });
server.register(storeRoute, { prefix: "stores" });
server.register(campainRoute, { prefix: "campaigns" });
server.register(categoryRoute, { prefix: "categories" });
server.register(gameRoute, { prefix: "games" });

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
