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
import { uniqBy } from "helpers";
import { Prisma, simplifyCampaigns, simplifyCategories, Store } from "database";
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
      const take = req.query.take ? Number(req.query.take) : undefined;
      const skip = req.query.skip ? Number(req.query.skip) : undefined;
      const categoryId = req.query.categoryId
        ? Number(req.query.categoryId)
        : undefined;
      const merchantId = req.query.merchantId
        ? Number(req.query.merchantId)
        : undefined;
      const nearBy: { lat: number | null; lng: number | null } = {
        lat: null,
        lng: null,
      };
      if (req.query.nearBy) {
        const [lat, lng] = req.query.nearBy
          .split(",")
          .map((part) => Number(part.trim()));
        if (isNaN(lat) || isNaN(lng)) {
          reply.code(400);
          throw new Error("Invalid nearBy query");
        }
        nearBy.lat = lat;
        nearBy.lng = lng;
      }
      const takeAndSkip = Prisma.sql`LIMIT ${take} OFFSET ${skip}`;

      const storeIds = uniqBy(
        await fastify.prisma.$queryRaw<{ id: number }[]>`
          SELECT "Store"."id" FROM "Store" ${
            categoryId
              ? Prisma.sql`LEFT JOIN "CategoriesOnStores" ON "CategoriesOnStores"."storeId" = id WHERE "CategoriesOnStores"."categoryId" = ${categoryId}`
              : Prisma.empty
          } ${
          merchantId
            ? categoryId
              ? Prisma.sql`AND`
              : Prisma.sql`WHERE`
            : Prisma.empty
        } ${
          merchantId
            ? Prisma.sql`"Store"."merchantId" = ${merchantId}`
            : Prisma.empty
        } ORDER BY ${
          nearBy.lat && nearBy.lng
            ? Prisma.sql`(POW((lng-${nearBy.lng}),2) + POW((lat-${nearBy.lat}),2)) ASC, "Store"."createdAt" DESC`
            : Prisma.sql`"Store"."createdAt" DESC`
        } ${takeAndSkip}
        `,
        "id"
      );

      const stores = await fastify.prisma.store.findMany({
        // take: take,
        // skip: skip,
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
        where: {
          id: {
            in: storeIds.map((store) => store.id),
          },
        },
        // orderBy: {
        //   createdAt: "asc",
        // },
        // where: whereCondition,
      });
      // https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/working-with-many-to-many-relations
      return storeIds.map((storeId) => {
        const store = stores.find(
          (store) => store.id === storeId.id
        ) as typeof stores[0];
        return {
          ...store,
          categories: simplifyCategories(store.categories),
          campaigns: simplifyCampaigns(store.campaigns),
        };
      });
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
    {
      onRequest: [fastify.auth.verifyEmployee],
      schema: { body: StoreSchema },
    },
    async function (req, reply) {
      const { categoryIds, ...rest } = req.body;
      fastify.auth.verifyHasMerchantPermission(req, reply, rest.merchantId);
      const store = await fastify.prisma.store.create({
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
      return store;
    }
  );

  fastify.put<{ Body: StoreUpdateBody; Params: IdParamsType }>(
    "/:id",
    {
      onRequest: [fastify.auth.verifyEmployee],
      schema: { body: StoreUpdateSchema, params: IdParamsSchema },
    },
    async function (req, reply) {
      const currentStore = await fastify.prisma.store.findUnique({
        where: {
          id: req.params.id,
        },
      });
      if (!currentStore) {
        reply.code(404);
        throw new Error("Store not found");
      }
      fastify.auth.verifyHasMerchantPermission(
        req,
        reply,
        currentStore.merchantId
      );
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
    {
      onRequest: [fastify.auth.verifyEmployee],
      schema: { params: IdParamsSchema },
    },
    async function (req, reply) {
      const currentStore = await fastify.prisma.store.findUnique({
        where: {
          id: req.params.id,
        },
      });
      if (!currentStore) {
        reply.code(404);
        throw new Error("Store not found");
      }
      fastify.auth.verifyHasMerchantPermission(
        req,
        reply,
        currentStore.merchantId
      );
      // delete all campaigns on store
      await fastify.prisma.campaignsOnStores.deleteMany({
        where: {
          storeId: currentStore.id,
        },
      });
      // delete all categories on store
      await fastify.prisma.categoriesOnStores.deleteMany({
        where: {
          storeId: currentStore.id,
        },
      });
      await fastify.prisma.store.delete({
        where: {
          id: currentStore.id,
        },
      });
    }
  );
}

export default storeRoutes;
