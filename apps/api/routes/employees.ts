import { FastifyPluginOptions, FastifyInstance, FastifyRequest } from "fastify";
import { IdParamsSchema, IdParamsType } from "database/schema/id";
import {
  EmployeeCreateSchema,
  EmployeeCreateBody,
  EmployeeUpdateBody,
  EmployeeUpdateSchema,
} from "database/schema/employees";
// import Employees from "../models/EmployeeModel";
import { Employee, hashPassword } from "database";
import type { Extended } from "helpers";
type ExtendedEmployee = Extended<Employee>;
function excludePassword(
  employees: ExtendedEmployee[] | ExtendedEmployee | null
) {
  if (!employees) return null;
  if (Array.isArray(employees)) {
    return employees.map((employee) => {
      const { password, ...rest } = employee;
      return rest;
    });
  } else {
    const { password, ...rest } = employees;
    return rest;
  }
}
async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get("/", async function (req, reply) {
    const employees = await fastify.prisma.employee.findMany({
      include: {
        merchant: true,
      },
      orderBy: {
        id: "asc",
      },
    });
    return excludePassword(employees);
  });
  fastify.get<{ Params: IdParamsType }>(
    "/:id",
    { schema: { params: IdParamsSchema } },
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
    { schema: { body: EmployeeCreateSchema } },
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
