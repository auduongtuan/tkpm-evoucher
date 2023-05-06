import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { IdParamsSchema, IdParamsType } from "../schema/id";
import {
  StoreSchema,
  StoreType,
  StoreUpdateSchema,
  StoreUpdateType,
} from "../schema/stores";
async function storeRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get("/", async function (req, reply) {
    return fastify.prisma.merchant.findMany();
  });
  fastify.get<{ Params: IdParamsType }>("/:id", async function (req, reply) {
    return await fastify.prisma.merchant.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        stores: true,
        staffs: true,
      },
    });
  });
  fastify.post<{ Body: StoreType }>(
    "/",
    { schema: { body: StoreSchema } },
    async function (req, reply) {
      return fastify.prisma.store.create({
        data: {
          ...req.body,
        },
      });
    }
  );

  fastify.put<{ Body: StoreUpdateType; Params: IdParamsType }>(
    "/:id",
    { schema: { body: StoreUpdateSchema, params: IdParamsSchema } },
    async function (req, reply) {
      return await fastify.prisma.store.update({
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
    { schema: { params: IdParamsSchema } },
    async function (req, reply) {
      await fastify.prisma.store.delete({
        where: {
          id: req.params.id,
        },
      });
    }
  );
}

export default storeRoutes;
