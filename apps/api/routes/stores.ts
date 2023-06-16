import { PaginationQueryType } from "database/schema/pagination";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { IdParamsSchema, IdParamsType } from "database/schema/id";
import {
  StoreSchema,
  StoreCreateBody,
  StoreUpdateSchema,
  StoreUpdateBody,
  StoresParamsType,
} from "database/schema/stores";
import { simplifyCampaigns, simplifyCategories } from "database";
async function storeRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get<{ Querystring: PaginationQueryType & StoresParamsType }>(
    "/",
    async function (req, reply) {
      const whereCondition = {
        categories: req.query.categoryId
          ? {
              some: {
                categoryId: req.query.categoryId
                  ? Number(req.query.categoryId)
                  : undefined,
              },
            }
          : undefined,
      };

      const stores = await fastify.prisma.store.findMany({
        take: req.query.take ? Number(req.query.take) : undefined,
        skip: req.query.skip ? Number(req.query.skip) : undefined,
        include: {
          merchant: true,
          categories: {
            include: {
              category: true,
            },
          },
          campaigns: {
            include: {
              campaign: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
        where: whereCondition,
      });
      // https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/working-with-many-to-many-relations
      return stores.map((store) => ({
        ...store,
        categories: simplifyCategories(store.categories),
        campaigns: simplifyCampaigns(store.campaigns),
      }));
    }
  );

  fastify.get<{ Params: IdParamsType }>(
    "/:id",
    { schema: { params: IdParamsSchema } },
    async function (req, reply) {
      const store = await fastify.prisma.store.findUnique({
        where: {
          id: req.params.id,
        },
        include: {
          merchant: true,
          categories: {
            include: {
              category: true,
            },
          },
          campaigns: {
            include: {
              campaign: true,
            },
          },
        },
      });
      return store
        ? {
            ...store,
            categories: simplifyCategories(store.categories),
            campaigns: simplifyCampaigns(store.campaigns),
          }
        : null;
    }
  );
  fastify.post<{ Body: StoreCreateBody }>(
    "/",
    { schema: { body: StoreSchema } },
    async function (req, reply) {
      const { categoryIds, ...rest } = req.body;
      return fastify.prisma.store.create({
        data: {
          ...rest,
          categories: categoryIds
            ? {
                create: categoryIds.map((categoryId) => ({
                  category: {
                    connect: {
                      id: categoryId,
                    },
                  },
                })),
              }
            : undefined,
        },
      });
    }
  );

  fastify.put<{ Body: StoreUpdateBody; Params: IdParamsType }>(
    "/:id",
    { schema: { body: StoreUpdateSchema, params: IdParamsSchema } },
    async function (req, reply) {
      const { categoryIds, ...rest } = req.body;
      return await fastify.prisma.store.update({
        where: {
          id: req.params.id,
        },
        data: {
          ...rest,
          categories: categoryIds
            ? {
                deleteMany: {},
                create: categoryIds.map((categoryId) => ({
                  category: {
                    connect: {
                      id: categoryId,
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
      await fastify.prisma.store.delete({
        where: {
          id: req.params.id,
        },
      });
    }
  );
}

export default storeRoutes;
