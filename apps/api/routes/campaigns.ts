import { FastifyPluginOptions, FastifyInstance, FastifyRequest } from "fastify";
// import CampaignModel from "../models/CampaignModel";
async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get("/", async (request, reply) => {
    const campaigns = await fastify.prisma.campaign.findMany();
    return campaigns;
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
      // const campaignModel = CampaignModel(fastify.prisma.campaign);
      if (Number.isNaN(request.params.id)) {
        reply.statusCode = 400;
        throw new Error("Bad request");
      }
      const campaign = await fastify.prisma.campaign.findUnique({
        where: {
          id: parseInt(request.params.id),
        },
        include: {
          merchant: true,
          stores: true,
        },
      });
      if (!campaign) {
        reply.statusCode = 404;
        throw new Error("Campaign not found");
      }
      return campaign;
    }
  );
}

export default routes;
