import Fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
// import { Server, IncomingMessage, ServerResponse } from "http";
import prismaPlugin from "./plugins/prisma";
import employeeRoute from "./routes/employees";
import userRoute from "./routes/users";
import merchantRoute from "./routes/merchants";
import campainRoute from "./routes/campaigns";
import storeRoute from "./routes/stores";
import categoryRoute from "./routes/categories";
import gameRoute from "./routes/games";
import voucherRoute from "./routes/vouchers";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Prisma } from "database";
import { createError } from "@fastify/error";
import employeeAuthRoute from "./routes/employeesAuth";
import userAuthRoute from "./routes/usersAuth";
import authentication from "./plugins/authentication";
import commonRoute from "./routes/common";
import fastifyStatic from "@fastify/static";
import path from "path";
import { getApiUrl } from "./helpers/apiUrl";
const server: FastifyInstance =
  Fastify().withTypeProvider<TypeBoxTypeProvider>();
server.register(cors, {
  origin: ["*"],
});
server.register(multipart);
server.register(prismaPlugin);
server.register(authentication);
server.register(employeeAuthRoute, { prefix: "employees/auth" });
server.register(employeeRoute, { prefix: "employees" });
server.register(userAuthRoute, { prefix: "users/auth" });
server.register(userRoute, { prefix: "users" });
server.register(merchantRoute, { prefix: "merchants" });
server.register(storeRoute, { prefix: "stores" });
server.register(campainRoute, { prefix: "campaigns" });
server.register(categoryRoute, { prefix: "categories" });
server.register(gameRoute, { prefix: "games" });
server.register(voucherRoute, { prefix: "vouchers" });
server.register(commonRoute);
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
    } else {
      if (error.code == "P2003") {
        const CustomError = createError(
          "Prisma_P2003",
          "Foreign key constraint failed",
          400
        );
        reply.send(new CustomError());
        return;
      }
    }
  }
  reply.send(error);
});
server.register(fastifyStatic, {
  root: path.join(__dirname, "uploads"),
  prefix: "/uploads/", // optional: default '/'
  // constraints: { host: 'example.com' } // optional: default {}
});

const start = async () => {
  try {
    await server.listen({ host: "localhost", port: 8080 });
    // const address = server.server.address();
    // const port = typeof address === "string" ? address : address?.port;
    console.log(`Server running at ${getApiUrl(server)}`);
    console.log();
  } catch (err) {
    server.log.error(err);
    console.log(err);
    // process.exit(1);
  }
};
start();
