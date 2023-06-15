// Use TypeScript module augmentation to declare the type of server.prisma to be PrismaClient
export {};
import { FastifyInstance, FastifyRequest } from "fastify";
import { Employee, PrismaClient, User } from "database";
import { EmployeePayload, UserPayload } from "./plugins/authentication";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    auth: {
      sign: (payload: EmployeePayload | UserPayload) => string;
      verifyEmployee: () => void;
      verifyUser: () => void;
      verifySystemAdmin: () => void;
    };
  }
  interface FastifyRequest {
    employee?: Employee;
    user?: User;
  }
}
