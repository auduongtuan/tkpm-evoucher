import { FastifyPluginOptions, FastifyInstance, FastifyRequest } from "fastify";
// import MerchantModel from "../models/MerchantModel";
import {
  listMiddleware,
  viewMiddleware,
  deleteMiddleware,
} from "../middlewares/crud";
async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get(
    "/",
    listMiddleware("Category", async () => {
      const categories = await fastify.prisma.category.findMany();
      return categories;
    })
  );
  fastify.get(
    "/:id",
    viewMiddleware("Merchant", async (id) => {
      return await fastify.prisma.merchant.findUnique({
        where: {
          id: id,
        },
        include: {
          stores: true,
          staffs: true,
        },
      });
    })
  );
  fastify.delete(
    "/:id",
    deleteMiddleware("Merchant", async (id) => {
      await fastify.prisma.merchant.delete({
        where: {
          id: id,
        },
      });
    })
  );
}

export default routes;