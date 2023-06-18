import { VouchersParamsType } from "./../../../packages/database/schema/vouchers";
import {
  FastifyPluginOptions,
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import { IdParamsSchema, IdParamsType } from "database/schema/id";
import {
  VoucherCreateSchema,
  VoucherCreateBody,
  VoucherUpdateBody,
  VoucherUpdateSchema,
  VoucherGenerateBody,
} from "database/schema/vouchers";
import { computeVoucherStatus } from "database";
async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get<{ Querystring: VouchersParamsType }>(
    "/",
    {
      onRequest: [fastify.auth.verifyEmployee],
    },
    async function (req, reply) {
      const merchantId = req.query.merchantId
        ? Number(req.query.merchantId)
        : undefined;
      if (!req.employee?.systemAdmin) {
        if (!merchantId) {
          reply.statusCode = 400;
          throw new Error("Merchant ID is required for non-admin");
        }
      }
      const vouchers = await fastify.prisma.voucher.findMany({
        include: {
          user: true,
          campaign: true,
        },
        orderBy: {
          id: "asc",
        },
        where: {
          ...(merchantId ? { campaign: { merchantId } } : {}),
        },
      });
      return vouchers.map((voucher) => computeVoucherStatus(voucher));
    }
  );
  fastify.get<{ Params: IdParamsType }>(
    "/:id",
    {
      onRequest: [fastify.auth.verifyEmployee],
      schema: { params: IdParamsSchema },
    },
    async function (req, reply) {
      const voucher = await fastify.prisma.voucher.findUnique({
        where: {
          id: req.params.id,
        },
        include: {
          user: true,
          campaign: true,
        },
      });
      if (!voucher) {
        reply.statusCode = 404;
        throw new Error("Voucher not found");
      }
      fastify.auth.verifyHasMerchantPermission(
        req,
        reply,
        voucher.campaign.merchantId
      );
      return voucher ? computeVoucherStatus(voucher) : null;
    }
  );
  fastify.post<{ Body: VoucherCreateBody }>(
    "/",
    {
      onRequest: [fastify.auth.verifyEmployee],
      schema: { body: VoucherCreateSchema },
    },
    async function (req, reply) {
      const { campaignId } = req.body;
      const campaign = await fastify.prisma.campaign.findUnique({
        where: {
          id: campaignId,
        },
      });
      if (!campaign) {
        reply.statusCode = 404;
        throw new Error("Campaign not found");
      }
      console.log("CAMPAIGN ID", campaign.merchantId, req.employee?.merchantId);
      fastify.auth.verifyHasMerchantPermission(req, reply, campaign.merchantId);
      return fastify.prisma.voucher.create({
        data: {
          ...req.body,
        },
      });
    }
  );
  async function verifyPermissionOnVoucher(
    req: FastifyRequest,
    reply: FastifyReply,
    voucherId: number
  ) {
    const voucher = await fastify.prisma.voucher.findUnique({
      include: {
        campaign: true,
      },
      where: {
        id: voucherId,
      },
    });
    if (!voucher) {
      reply.statusCode = 404;
      throw new Error("Voucher not found");
    }
    fastify.auth.verifyHasMerchantPermission(
      req,
      reply,
      voucher.campaign.merchantId
    );
  }
  fastify.put<{ Body: VoucherUpdateBody; Params: IdParamsType }>(
    "/:id",
    {
      onRequest: [fastify.auth.verifyEmployee],
      schema: { body: VoucherUpdateSchema, params: IdParamsSchema },
    },
    async function (req, reply) {
      await verifyPermissionOnVoucher(req, reply, req.params.id);
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
    {
      onRequest: [fastify.auth.verifySystemAdmin],
      schema: { params: IdParamsSchema },
    },
    async function (req, reply) {
      await verifyPermissionOnVoucher(req, reply, req.params.id);
      await fastify.prisma.voucher.delete({
        where: {
          id: req.params.id,
        },
      });
    }
  );
}

export default routes;
