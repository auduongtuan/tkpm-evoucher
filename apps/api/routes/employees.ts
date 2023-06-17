import { FastifyPluginOptions, FastifyInstance } from "fastify";
import { IdParamsSchema, IdParamsType } from "database/schema/id";
import {
  EmployeeCreateSchema,
  EmployeeCreateBody,
  EmployeeUpdateBody,
  EmployeeUpdateSchema,
} from "database/schema/employees";
// import Employees from "../models/EmployeeModel";
import { hashPassword } from "database";
import { excludePassword } from "database";

async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get(
    "/",
    { onRequest: [fastify.auth.verifySystemAdmin] },
    async function (req, reply) {
      const employees = await fastify.prisma.employee.findMany({
        include: {
          merchant: true,
        },
        orderBy: {
          id: "asc",
        },
      });
      return excludePassword(employees);
    }
  );
  fastify.get<{ Params: IdParamsType }>(
    "/:id",
    {
      onRequest: [fastify.auth.verifySystemAdmin],
      schema: { params: IdParamsSchema },
    },
    async function (req, reply) {
      const employee = await fastify.prisma.employee.findUnique({
        where: {
          id: req.params.id,
        },
        include: {
          merchant: true,
        },
      });
      return excludePassword(employee);
    }
  );
  fastify.post<{ Body: EmployeeCreateBody }>(
    "/",
    {
      onRequest: [fastify.auth.verifySystemAdmin],
      schema: { body: EmployeeCreateSchema },
    },
    async function (req, reply) {
      const { password, ...rest } = req.body;
      const employee = await fastify.prisma.employee.create({
        data: {
          ...rest,
          password: hashPassword(password),
        },
      });
      return excludePassword(employee);
    }
  );
  fastify.put<{ Body: EmployeeUpdateBody; Params: IdParamsType }>(
    "/:id",
    { schema: { body: EmployeeUpdateSchema, params: IdParamsSchema } },
    async function (req, reply) {
      const { password, ...rest } = req.body;
      const employee = await fastify.prisma.employee.update({
        where: {
          id: req.params.id,
        },
        data: {
          ...rest,
          ...(password
            ? {
                password: hashPassword(password),
              }
            : {}),
        },
      });
      return excludePassword(employee);
    }
  );
  fastify.delete<{ Params: IdParamsType }>(
    "/:id",
    { schema: { params: IdParamsSchema } },
    async function (req, reply) {
      await fastify.prisma.employee.delete({
        where: {
          id: req.params.id,
        },
      });
    }
  );
}

export default routes;
