import fp from "fastify-plugin";
import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from "fastify";
import { PrismaClient } from "database";

const prismaPlugin: FastifyPluginAsync = fp(
  async (server: FastifyInstance, options: FastifyPluginOptions) => {
    const prisma = new PrismaClient();

    await prisma.$connect();

    // Make Prisma Client available through the fastify server instance: server.prisma
    server.decorate("prisma", prisma);

    server.addHook("onClose", async (server) => {
      await server.prisma.$disconnect();
    });
  }
);

export default prismaPlugin;
