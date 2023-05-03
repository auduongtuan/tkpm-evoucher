import { FastifyPluginOptions, FastifyInstance, FastifyRequest } from "fastify";
import {
  deleteMiddleware,
  viewMiddleware,
  listMiddleware,
} from "../middlewares/crud";
async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get(
    "/",
    listMiddleware("Store", async () => {
      const stores = await fastify.prisma.store.findMany();
      return stores;
    })
  );
  fastify.get(
    "/:id",
    viewMiddleware("Store", async (id) => {
      return await fastify.prisma.store.findUnique({
        where: {
          id: id,
        },
        include: {
          merchant: true,
        },
      });
    })
  );

  fastify.delete(
    "/:id",
    deleteMiddleware("Store", async (id) => {
      await fastify.prisma.store.delete({
        where: {
          id: id,
        },
      });
    })
  );
}

export default routes;
