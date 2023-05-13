import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { IdParamsSchema, IdParamsType } from "../schema/id";
import {
  CampaignCreateSchema,
  CampaignCreateBody,
  CampaignUpdateSchema,
  CampaignUpdateBody,
} from "../schema/campaigns";
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
