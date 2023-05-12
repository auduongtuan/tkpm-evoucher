import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { IdParamsSchema, IdParamsType } from "../schema/id";
import {
  StoreSchema,
  StoreCreateBody,
  StoreUpdateSchema,
  StoreUpdateBody,
} from "../schema/stores";
async function storeRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get("/", async function (req, reply) {
    const stores = await fastify.prisma.store.findMany({
      include: {
        merchant: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    // https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/working-with-many-to-many-relations
    return stores.map((store) => ({
      ...store,
      categories: store.categories.map((category) => category.category),
    }));
  });
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
        },
      });
      return store
        ? {
            ...store,
            categories: store.categories.map((category) => category.category),
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
