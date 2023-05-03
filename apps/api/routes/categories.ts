import { FastifyPluginOptions, FastifyInstance, FastifyRequest } from "fastify";
import {
  viewMiddleware,
  deleteMiddleware,
  listMiddleware,
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
    viewMiddleware("Category", async (id) => {
      return await fastify.prisma.category.findUnique({
        where: {
          id: id,
        },
        include: {
          stores: true,
        },
      });
    })
  );

  fastify.delete(
    "/:id",
    deleteMiddleware("Category", async (id) => {
      await fastify.prisma.category.delete({
        where: {
          id: id,
        },
      });
    })
  );
}

export default routes;
