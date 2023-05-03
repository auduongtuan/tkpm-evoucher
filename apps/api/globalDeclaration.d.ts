// Use TypeScript module augmentation to declare the type of server.prisma to be PrismaClient
export {};
import { FastifyInstance } from "fastify";
import { PrismaClient } from "database";
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
