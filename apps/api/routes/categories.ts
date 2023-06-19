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
      console.log("RUN CATEGORY POST");
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
      const category = await fastify.prisma.category.findUnique({
        where: {
          id: req.params.id,
        },
      });
      if (!category) {
        reply.statusCode = 404;
        throw new Error("Category not found");
      }
      await fastify.prisma.categoriesOnStores.deleteMany({
        where: {
          categoryId: req.params.id,
        },
      });
      await fastify.prisma.category.delete({
        where: {
          id: req.params.id,
        },
      });
    }
  );
}

export default routes;
