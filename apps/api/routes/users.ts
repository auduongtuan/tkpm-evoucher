import { FastifyPluginOptions, FastifyInstance, FastifyRequest } from "fastify";
import { IdParamsSchema, IdParamsType } from "database/schema/id";
import {
  UserCreateSchema,
  UserCreateBody,
  UserUpdateBody,
  UserUpdateSchema,
  UserFindQueryType,
  UserFindQuerySchema,
} from "database";
// import Users from "../models/UserModel";
import { User, hashPassword, excludePassword } from "database";

async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get(
    "/",
    {
      onRequest: [fastify.auth.verifySystemAdmin],
    },
    async function (req, reply) {
      const users = await fastify.prisma.user.findMany({
        include: {
          vouchers: true,
        },
        orderBy: {
          id: "asc",
        },
      });
      return excludePassword(users);
    }
  );

  fastify.get<{ Querystring: UserFindQueryType }>(
    "/find",
    {
      onRequest: [fastify.auth.verifyEmployee],
      schema: UserFindQuerySchema,
    },
    async function (req, reply) {
      const { email, phone } = req.query;
      const user = await fastify.prisma.user.findFirst({
        where: {
          OR: [{ email: email }, { phone: phone }],
        },
      });
      return excludePassword(user);
    }
  );

  fastify.get<{ Params: IdParamsType }>(
    "/:id",
    {
      onRequest: [fastify.auth.verifySystemAdmin],
      schema: { params: IdParamsSchema },
    },
    async function (req, reply) {
      const user = await fastify.prisma.user.findUnique({
        where: {
          id: req.params.id,
        },
        include: {
          vouchers: true,
        },
      });
      return excludePassword(user);
    }
  );

  fastify.post<{ Body: UserCreateBody }>(
    "/",
    { schema: { body: UserCreateSchema } },
    async function (req, reply) {
      const { password, ...rest } = req.body;
      const user = await fastify.prisma.user.create({
        data: {
          ...rest,
          password: hashPassword(password),
        },
      });
      return excludePassword(user);
    }
  );
  fastify.put<{ Body: UserUpdateBody; Params: IdParamsType }>(
    "/:id",
    { schema: { body: UserUpdateSchema, params: IdParamsSchema } },
    async function (req, reply) {
      const { password, ...rest } = req.body;
      const user = await fastify.prisma.user.update({
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
      return excludePassword(user);
    }
  );
  fastify.delete<{ Params: IdParamsType }>(
    "/:id",
    {
      schema: { params: IdParamsSchema },
      onRequest: [fastify.auth.verifySystemAdmin],
    },
    async function (req, reply) {
      await fastify.prisma.user.delete({
        where: {
          id: req.params.id,
        },
      });
    }
  );
}

export default routes;
