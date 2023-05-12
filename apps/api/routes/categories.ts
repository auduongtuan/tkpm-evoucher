import { FastifyPluginOptions, FastifyInstance, FastifyRequest } from "fastify";
import { IdParamsSchema, IdParamsType } from "../schema/id";
import { CategoryCreateSchema, CategoryCreateBody } from "../schema/categories";
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
      console.log(req.params.id);
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
    { schema: { body: CategoryCreateSchema } },
    async function (req, reply) {
      return fastify.prisma.category.create({
        data: {
          name: req.body.name,
        },
      });
    }
  );
  fastify.put<{ Body: CategoryCreateBody; Params: IdParamsType }>(
    "/:id",
    { schema: { body: CategoryCreateSchema, params: IdParamsSchema } },
    async function (req, reply) {
      return await fastify.prisma.category.update({
        where: {
          id: req.params.id,
        },
        data: {
          name: req.body.name,
        },
      });
    }
  );
  fastify.delete<{ Params: IdParamsType }>(
    "/:id",
    { schema: { params: IdParamsSchema } },
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
