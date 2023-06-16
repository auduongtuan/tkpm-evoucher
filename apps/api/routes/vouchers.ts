import { FastifyPluginOptions, FastifyInstance, FastifyRequest } from "fastify";
import { IdParamsSchema, IdParamsType } from "database/schema/id";
import {
  VoucherCreateSchema,
  VoucherCreateBody,
  VoucherUpdateBody,
  VoucherUpdateSchema,
  VoucherGenerateBody,
} from "database/schema/vouchers";
async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get("/", async function (req, reply) {
    return fastify.prisma.voucher.findMany({
      include: {
        user: true,
        campaign: true,
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
      return await fastify.prisma.voucher.findUnique({
        where: {
          id: req.params.id,
        },
        include: {
          user: true,
          campaign: true,
        },
      });
    }
  );
  fastify.post<{ Body: VoucherCreateBody }>(
    "/",
    { schema: { body: VoucherCreateSchema } },
    async function (req, reply) {
      return fastify.prisma.voucher.create({
        data: {
          ...req.body,
        },
      });
    }
  );
  fastify.put<{ Body: VoucherUpdateBody; Params: IdParamsType }>(
    "/:id",
    { schema: { body: VoucherUpdateSchema, params: IdParamsSchema } },
    async function (req, reply) {
      return await fastify.prisma.voucher.update({
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
      await fastify.prisma.voucher.delete({
        where: {
          id: req.params.id,
        },
      });
    }
  );
}

export default routes;
