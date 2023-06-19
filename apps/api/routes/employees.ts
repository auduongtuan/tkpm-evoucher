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
          createdAt: "desc",
        },
      });
      return excludePassword(employees);
    }
  );
  fastify.get<{ Params: IdParamsType }>(
    "/:id",
    {
      onRequest: [fastify.auth.verifyEmployee],
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
      if (!employee) {
        reply.statusCode = 404;
        throw new Error("Employee not found");
      }
      fastify.auth.verifyHasMerchantPermission(
        req,
        reply,
        employee.merchantId as number
      );
      return excludePassword(employee);
    }
  );
  fastify.post<{ Body: EmployeeCreateBody }>(
    "/",
    {
      onRequest: [fastify.auth.verifyEmployee],
      schema: { body: EmployeeCreateSchema },
    },
    async function (req, reply) {
      const { password, merchantId, systemAdmin, ...rest } = req.body;
      fastify.auth.verifyHasMerchantPermission(req, reply, merchantId);
      const employee = await fastify.prisma.employee.create({
        data: {
          ...rest,
          merchantId:
            req.employee?.systemAdmin && systemAdmin ? null : merchantId,
          systemAdmin: req.employee?.systemAdmin && systemAdmin ? true : false,
          password: hashPassword(password),
        },
      });
      return excludePassword(employee);
    }
  );
  fastify.put<{ Body: EmployeeUpdateBody; Params: IdParamsType }>(
    "/:id",
    {
      onRequest: [fastify.auth.verifyEmployee],
      schema: { body: EmployeeUpdateSchema, params: IdParamsSchema },
    },
    async function (req, reply) {
      const currentEmployee = await fastify.prisma.employee.findUnique({
        where: {
          id: req.params.id,
        },
      });
      if (!currentEmployee) {
        reply.statusCode = 404;
        throw new Error("Employee not found");
      }
      fastify.auth.verifyHasMerchantPermission(
        req,
        reply,
        currentEmployee.merchantId
      );
      const { password, systemAdmin, merchantId, ...rest } = req.body;
      const employee = await fastify.prisma.employee.update({
        where: {
          id: req.params.id,
        },
        data: {
          ...rest,
          systemAdmin: req.employee?.systemAdmin && systemAdmin ? true : false,
          merchantId:
            req.employee?.systemAdmin && systemAdmin ? null : merchantId,
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
    {
      onRequest: [fastify.auth.verifyEmployee],
      schema: { params: IdParamsSchema },
    },
    async function (req, reply) {
      const currentEmployee = await fastify.prisma.employee.findUnique({
        where: {
          id: req.params.id,
        },
      });
      if (!currentEmployee) {
        reply.statusCode = 404;
        throw new Error("Employee not found");
      }
      fastify.auth.verifyHasMerchantPermission(
        req,
        reply,
        currentEmployee.merchantId
      );
      await fastify.prisma.employee.delete({
        where: {
          id: req.params.id,
        },
      });
    }
  );
}

export default routes;
