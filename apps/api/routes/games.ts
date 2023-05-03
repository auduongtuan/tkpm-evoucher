import { FastifyPluginOptions, FastifyInstance, FastifyRequest } from "fastify";
import {
  deleteMiddleware,
  viewMiddleware,
  listMiddleware,
} from "../middlewares/crud";
async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get(
    "/",
    listMiddleware("Game", async () => {
      const games = await fastify.prisma.game.findMany();
      return games;
    })
  );
  fastify.get(
    "/:id",
    viewMiddleware("Game", async (id) => {
      return await fastify.prisma.game.findUnique({
        where: {
          id: id,
        },
      });
    })
  );

  fastify.delete(
    "/:id",
    deleteMiddleware("Game", async (id) => {
      await fastify.prisma.game.delete({
        where: {
          id: id,
        },
      });
    })
  );
}

export default routes;
