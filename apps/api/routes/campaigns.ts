import { FastifyPluginOptions, FastifyInstance, FastifyRequest } from "fastify";
// import CampaignModel from "../models/CampaignModel";
import {
  deleteMiddleware,
  viewMiddleware,
  listMiddleware,
} from "../middlewares/crud";

async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get(
    "/",
    listMiddleware("Campaign", async () => {
      return await fastify.prisma.campaign.findMany({
        include: {
          merchant: true,
          stores: true,
        },
      });
    })
  );

  fastify.get(
    "/:id",
    viewMiddleware("Campaign", async (id) => {
      return await fastify.prisma.campaign.findUnique({
        where: {
          id: id,
        },
        include: {
          merchant: true,
          stores: true,
        },
      });
    })
  );

  fastify.delete(
    "/:id",
    deleteMiddleware("Campaign", async (id) => {
      await fastify.prisma.campaign.delete({
        where: {
          id: id,
        },
      });
    })
  );
}

export default routes;
