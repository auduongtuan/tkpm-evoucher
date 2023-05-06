import Fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
// import { Server, IncomingMessage, ServerResponse } from "http";
import prismaPlugin from "./plugins/prisma";
import staffRoute from "./routes/staffs";
import merchantRoute from "./routes/merchants";
import campainRoute from "./routes/campaigns";
import storeRoute from "./routes/stores";
import categoryRoute from "./routes/categories";
import gameRoute from "./routes/games";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Prisma } from "database";
import { createError } from "@fastify/error";
const server: FastifyInstance =
  Fastify().withTypeProvider<TypeBoxTypeProvider>();
server.register(cors, {
  origin: ["http://localhost:5173"],
});
// server.register(multipart);
server.register(prismaPlugin);
server.register(staffRoute, { prefix: "staffs" });
server.register(merchantRoute, { prefix: "merchants" });
server.register(storeRoute, { prefix: "stores" });
server.register(campainRoute, { prefix: "campaigns" });
server.register(categoryRoute, { prefix: "categories" });
server.register(gameRoute, { prefix: "games" });
server.setErrorHandler(function (error, request, reply) {
  // Log error
  server.log.error(error);
  // Send error response
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code == "P2025") {
      const CustomError = createError(
        "Prisma_P2025",
        "Record does not exist",
        404
      );
      reply.send(new CustomError());
      return;
    }
  }
  reply.send(error);
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
