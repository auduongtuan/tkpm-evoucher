import { FastifyPluginOptions, FastifyInstance, FastifyRequest } from "fastify";
import { IdParamsSchema, IdParamsType } from "../schema/id";
import {
  UserCreateSchema,
  UserCreateBody,
  UserUpdateBody,
  UserUpdateSchema,
} from "../schema/users";
// import Users from "../models/UserModel";
import { User, hashPassword } from "database";
import type { Extended } from "helpers";
type ExtendedUser = Extended<User>;
function excludePassword(users: ExtendedUser[] | ExtendedUser | null) {
  if (!users) return null;
  if (Array.isArray(users)) {
    return users.map((user) => {
      const { password, ...rest } = user;
      return rest;
    });
  } else {
    const { password, ...rest } = users;
    return rest;
  }
}
async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get("/", async function (req, reply) {
    const users = await fastify.prisma.user.findMany({
      include: {
        vouchers: true,
      },
      orderBy: {
        id: "asc",
      },
    });
    return excludePassword(users);
  });
  fastify.get<{ Params: IdParamsType }>(
    "/:id",
    { schema: { params: IdParamsSchema } },
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
    { schema: { params: IdParamsSchema } },
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
