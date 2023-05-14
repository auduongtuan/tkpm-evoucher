import { FastifyInstance, FastifyPluginOptions } from "fastify";
// import MerchantModel from "../models/MerchantModel";
import { IdParamsSchema, IdParamsType } from "../schema/id";
import { MerchantCreateSchema, MerchantCreateBody } from "../schema/merchants";
async function merchantRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get("/", async function (req, reply) {
    return fastify.prisma.merchant.findMany({
      include: {
        stores: true,
        employees: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  });
  fastify.get<{ Params: IdParamsType }>(
    "/:id",
    { schema: { params: IdParamsSchema } },
    async function (req, reply) {
      console.log(req.params.id);
      return await fastify.prisma.merchant.findUnique({
        where: {
          id: req.params.id,
        },
        include: {
          stores: true,
          employees: true,
        },
      });
    }
  );
  fastify.post<{ Body: MerchantCreateBody }>(
    "/",
    { schema: { body: MerchantCreateSchema } },
    async function (req, reply) {
      return fastify.prisma.merchant.create({
        data: {
          name: req.body.name,
          image: req.body.image,
        },
      });
    }
  );
  fastify.put<{ Body: MerchantCreateBody; Params: IdParamsType }>(
    "/:id",
    { schema: { body: MerchantCreateSchema, params: IdParamsSchema } },
    async function (req, reply) {
      return await fastify.prisma.merchant.update({
        where: {
          id: req.params.id,
        },
        data: {
          name: req.body.name,
          image: req.body.image,
        },
      });
    }
  );
  fastify.delete<{ Params: IdParamsType }>(
    "/:id",
    { schema: { params: IdParamsSchema } },
    async function (req, reply) {
      await fastify.prisma.merchant.delete({
        where: {
          id: req.params.id,
        },
      });
    }
  );
}

export default merchantRoutes;
