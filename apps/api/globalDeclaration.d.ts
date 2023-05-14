// Use TypeScript module augmentation to declare the type of server.prisma to be PrismaClient
export {};
import { FastifyInstance } from "fastify";
import { Employee, PrismaClient } from "database";
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    verifyEmployee: () => void;
  }
  interface FastifyRequest {
    employee?: Employee;
  }
}
