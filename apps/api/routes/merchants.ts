import { FastifyInstance, FastifyPluginOptions } from "fastify";
// import MerchantModel from "../models/MerchantModel";
import { IdParamsSchema, IdParamsType } from "../schema/id";
import { MerchantCreateSchema, MerchantCreateBody } from "../schema/merchants";
import { simplifyMerchant } from "database";
async function merchantRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get("/", async function (req, reply) {
    const merchants = await fastify.prisma.merchant.findMany({
      include: {
        stores: {
          include: {
            categories: {
              include: {
                category: true,
              },
            },
          },
        },
        employees: true,
        campaigns: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return merchants.map((merchant) => simplifyMerchant(merchant));
  });
  fastify.get<{ Params: IdParamsType }>(
    "/:id",
    { schema: { params: IdParamsSchema } },
    async function (req, reply) {
      const merchant = await fastify.prisma.merchant.findUnique({
        where: {
          id: req.params.id,
        },
        include: {
          stores: {
            include: {
              categories: {
                include: {
                  category: true,
                },
              },
            },
          },
          employees: true,
          campaigns: true,
        },
      });
      return simplifyMerchant(merchant);
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
          description: req.body.description,
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
          description: req.body.description,
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
