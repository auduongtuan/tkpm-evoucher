import { FastifyInstance, FastifyPluginOptions } from "fastify";
// import MerchantModel from "../models/MerchantModel";
import { IdParamsSchema, IdParamsType } from "database/schema/id";
import {
  MerchantCreateSchema,
  MerchantCreateBody,
} from "database/schema/merchants";
import {
  CategoriesOnStores,
  Store,
  excludePassword,
  simplifyMerchant,
  simplifyStores,
} from "database";
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
  // phan quyen employee
  fastify.get<{ Params: IdParamsType }>(
    "/:id",
    { schema: { params: IdParamsSchema } },
    async function (req, reply) {
      const merchant = await fastify.prisma.merchant.findUnique({
        where: {
          id: req.params.id,
        },
      });
      return merchant;
    }
  );
  // phan quyen employee
  fastify.get<{ Params: IdParamsType }>(
    "/:id/full",
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
  // get categories and stores of merchant
  fastify.get<{ Params: IdParamsType }>(
    "/:id/categories",
    { schema: { params: IdParamsSchema } },
    async function (req, reply) {
      const categories = await fastify.prisma.category.findMany({
        include: {
          stores: {
            include: {
              store: true,
            },
            where: {
              store: { merchantId: req.params.id },
            },
          },
        },
        orderBy: {
          id: "asc",
        },
        // where: {
        //   stores: { some: { store: { merchantId: req.params.id } } },
        // },
      });
      return categories.map((category) => {
        return {
          ...category,
          stores: category.stores.map((store) => store.store),
        };
      });
    }
  );
  // get categories and stores of merchant
  fastify.get<{ Params: IdParamsType }>(
    "/:id/employees",
    {
      onRequest: [fastify.auth.verifyEmployee],
      schema: { params: IdParamsSchema },
    },
    async function (req, reply) {
      fastify.auth.verifyHasMerchantPermission(req, reply, req.params.id);
      const employees = await fastify.prisma.employee.findMany({
        where: {
          merchantId: req.params.id,
          systemAdmin: false,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      return excludePassword(employees);
    }
  );
  // get campaigns of merchant
  fastify.get<{ Params: IdParamsType }>(
    "/:id/campaigns",
    {
      onRequest: [fastify.auth.verifyEmployee],
      schema: { params: IdParamsSchema },
    },
    async function (req, reply) {
      fastify.auth.verifyHasMerchantPermission(req, reply, req.params.id);
      const campaigns = await fastify.prisma.campaign.findMany({
        where: {
          merchantId: req.params.id,
        },
        include: {
          stores: true,
          games: true,
        },
      });
      return campaigns;
    }
  );
  fastify.post<{ Body: MerchantCreateBody }>(
    "/",
    {
      onRequest: [fastify.auth.verifySystemAdmin],
      schema: { body: MerchantCreateSchema },
    },
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
    {
      onRequest: [fastify.auth.verifyEmployee],
      schema: { body: MerchantCreateSchema, params: IdParamsSchema },
    },
    async function (req, reply) {
      fastify.auth.verifyHasMerchantPermission(req, reply, req.params.id);
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
    {
      onRequest: [fastify.auth.verifySystemAdmin],
      schema: { params: IdParamsSchema },
    },
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
