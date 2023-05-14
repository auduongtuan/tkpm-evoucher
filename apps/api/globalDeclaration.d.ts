// Use TypeScript module augmentation to declare the type of server.prisma to be PrismaClient
export {};
import { FastifyInstance, FastifyRequest } from "fastify";
import { Employee, PrismaClient } from "database";
import { EmployeePayload } from "./plugins/authentication";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    auth: {
      sign: (payload: EmployeePayload) => string;
      verifyEmployee: () => void;
      verifySystemAdmin: () => void;
    };
  }
  interface FastifyRequest {
    employee?: Employee;
  }
}
