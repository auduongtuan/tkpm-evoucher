import { FastifyPluginOptions, FastifyInstance, FastifyRequest } from "fastify";
import { IdParamsSchema, IdParamsType } from "database/schema/id";
import {
  CategoryCreateSchema,
  CategoryCreateBody,
  CategoryUpdateBody,
  CategoryUpdateSchema,
} from "database/schema/categories";
async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get("/", async function (req, reply) {
    return fastify.prisma.category.findMany({
      include: {
        stores: true,
      },
      orderBy: {
        id: "asc",
      },
    });
  });
  fastify.get<{ Params: IdParamsType }>(
    "/:id",
    { schema: { params: IdParamsSchema } },
    async function (req, reply) {
      return await fastify.prisma.category.findUnique({
        where: {
          id: req.params.id,
        },
        include: {
          stores: true,
        },
      });
    }
  );
  fastify.post<{ Body: CategoryCreateBody }>(
    "/",
    {
      schema: { body: CategoryCreateSchema },
      onRequest: [fastify.auth.verifySystemAdmin],
    },
    async function (req, reply) {
      return fastify.prisma.category.create({
        data: {
          ...req.body,
        },
      });
    }
  );
  fastify.put<{ Body: CategoryUpdateBody; Params: IdParamsType }>(
    "/:id",
    {
      schema: { body: CategoryUpdateSchema, params: IdParamsSchema },
      onRequest: [fastify.auth.verifySystemAdmin],
    },
    async function (req, reply) {
      return await fastify.prisma.category.update({
        where: {
          id: req.params.id,
        },
        data: {
          ...req.body,
        },
      });
    }
  );
  fastify.delete<{ Params: IdParamsType }>(
    "/:id",
    {
      schema: { params: IdParamsSchema },
      onRequest: [fastify.auth.verifySystemAdmin],
    },
    async function (req, reply) {
      await fastify.prisma.category.delete({
        where: {
          id: req.params.id,
        },
      });
    }
  );
}

export default routes;
