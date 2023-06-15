import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { IdParamsSchema, IdParamsType } from "../schema/id";
import {
  CampaignCreateSchema,
  CampaignCreateBody,
  CampaignUpdateSchema,
  CampaignUpdateBody,
} from "../schema/campaigns";
import { generate } from "voucher-codes-generator";
import { VoucherGenerateBody, VoucherGenerateSchema } from "../schema/vouchers";
async function campaignRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get("/", async function (req, reply) {
    const campaigns = await fastify.prisma.campaign.findMany({
      include: {
        merchant: true,
        games: {
          include: {
            game: true,
          },
        },
        stores: {
          include: {
            store: true,
          },
        },
        vouchers: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    // https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/working-with-many-to-many-relations
    return campaigns.map((campaign) => ({
      ...campaign,
      stores: campaign.stores.map((store) => store.store),
      games: campaign.games.map((game) => game.game),
    }));
  });
  fastify.get<{ Params: IdParamsType }>(
    "/:id",
    { schema: { params: IdParamsSchema } },
    async function (req, reply) {
      const campaign = await fastify.prisma.campaign.findUnique({
        where: {
          id: req.params.id,
        },
        include: {
          merchant: true,
          games: {
            include: {
              game: true,
            },
          },
          stores: {
            include: {
              store: true,
            },
          },
        },
      });
      return campaign
        ? {
            ...campaign,
            stores: campaign.stores.map((store) => store.store),
            games: campaign.games.map((game) => game.game),
          }
        : null;
    }
  );
  fastify.post<{ Body: CampaignCreateBody }>(
    "/",
    { schema: { body: CampaignCreateSchema } },
    async function (req, reply) {
      const { storeIds, gameIds, ...rest } = req.body;
      return fastify.prisma.campaign.create({
        data: {
          ...rest,
          stores: storeIds
            ? {
                create: storeIds.map((storeId) => ({
                  store: {
                    connect: {
                      id: storeId,
                    },
                  },
                })),
              }
            : undefined,
          games: gameIds
            ? {
                create: gameIds.map((gameId) => ({
                  game: {
                    connect: {
                      id: gameId,
                    },
                  },
                })),
              }
            : undefined,
        },
      });
    }
  );

  fastify.put<{ Body: CampaignUpdateBody; Params: IdParamsType }>(
    "/:id",
    { schema: { body: CampaignUpdateSchema, params: IdParamsSchema } },
    async function (req, reply) {
      const { storeIds, gameIds, ...rest } = req.body;
      return await fastify.prisma.campaign.update({
        where: {
          id: req.params.id,
        },
        data: {
          ...rest,
          stores: storeIds
            ? {
                // https://dev.to/frenkix/prisma-orm-update-explicit-many-to-many-relations-1o6f
                deleteMany: {},

                create: storeIds.map((storeId) => ({
                  store: {
                    connect: {
                      id: storeId,
                    },
                  },
                })),
              }
            : undefined,
          games: gameIds
            ? {
                deleteMany: {},

                create: gameIds.map((gameId) => ({
                  game: {
                    connect: {
                      id: gameId,
                    },
                  },
                })),
              }
            : undefined,
        },
      });
    }
  );
  fastify.post<{ Body: VoucherGenerateBody; Params: IdParamsType }>(
    "/:id/generate-voucher",
    { schema: { body: VoucherGenerateSchema, params: IdParamsSchema } },
    async function (req, reply) {
      const { userId, score } = req.body;
      const campaign = await fastify.prisma.campaign.findUnique({
        where: {
          id: req.params.id,
        },
      });
      if (!campaign) {
        reply.status(404);
        throw new Error("Campaign not found");
      }
      let voucherValue: number = -1;
      const GAME_AVG_SCORE = 10;
      const { maxVoucherFixed, maxVoucherPercent, discountType } = campaign;
      if (discountType === "PERCENT" && maxVoucherPercent) {
        voucherValue = Math.min(score / GAME_AVG_SCORE, 1) * maxVoucherPercent;
      } else if (discountType === "FIXED" && maxVoucherFixed) {
        voucherValue = Math.min(score / GAME_AVG_SCORE, 1) * maxVoucherFixed;
      }
      const voucherValueInBudget =
        (discountType === "FIXED" ? voucherValue : maxVoucherFixed) || 0;
      console.log(voucherValueInBudget);
      if (
        (campaign.spentBudget || 0) + voucherValueInBudget >
        (campaign.totalBudget || 0)
      ) {
        reply.status(403);
        throw new Error("Campaign budget exceeded");
      }
      if (voucherValue < 0 || !discountType) {
        reply.status(500);
        throw new Error("Invalid voucher value");
      }
      await fastify.prisma.campaign.update({
        where: {
          id: req.params.id,
        },
        data: {
          spentBudget: (campaign.spentBudget || 0) + voucherValueInBudget,
        },
      });
      const voucher = await fastify.prisma.voucher.create({
        data: {
          campaign: {
            connect: {
              id: req.params.id,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
          couponCode: generate("AA0A0A0A0A"),
          discountType: discountType,
          discountValue: voucherValue,
          maxDiscount:
            discountType === "PERCENT" ? maxVoucherFixed : maxVoucherPercent,
          expiredAt:
            campaign.endedAt || new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        },
      });
      return voucher;
    }
  );
  fastify.delete<{ Params: IdParamsType }>(
    "/:id",
    { schema: { params: IdParamsSchema } },
    async function (req, reply) {
      await fastify.prisma.campaign.delete({
        where: {
          id: req.params.id,
        },
      });
    }
  );
}

export default campaignRoutes;
