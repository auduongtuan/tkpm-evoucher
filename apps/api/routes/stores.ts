import { FastifyPluginOptions, FastifyInstance, FastifyRequest } from "fastify";
import deleteMiddleWare from "../middlewares/deleteMiddleware";
async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get("/", async (request, reply) => {
    const stores = await fastify.prisma.store.findMany();
    return stores;
  });

  fastify.get(
    "/:id",
    async (
      request: FastifyRequest<{
        Params: {
          id: string;
        };
      }>,
      reply
    ) => {
      // const storeModel = StoreModel(fastify.prisma.store);
      if (Number.isNaN(request.params.id)) {
        reply.statusCode = 400;
        throw new Error("Bad request");
      }
      const store = await fastify.prisma.store.findUnique({
        where: {
          id: parseInt(request.params.id),
        },
        include: {
          merchant: true,
        },
      });
      if (!store) {
        reply.statusCode = 404;
        throw new Error("Store not found");
      }
      return store;
    }
  );

  fastify.delete(
    "/:id",
    deleteMiddleWare("Store", async (id) => {
      await fastify.prisma.store.delete({
        where: {
          id: id,
        },
      });
    })
  );
}

export default routes;
