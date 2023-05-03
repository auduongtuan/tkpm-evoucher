import { FastifyPluginOptions, FastifyInstance, FastifyRequest } from "fastify";
// import MerchantModel from "../models/MerchantModel";
async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get("/", async (request, reply) => {
    const merchants = await fastify.prisma.merchant.findMany({
      include: {
        stores: true,
        staffs: true,
      },
    });
    return merchants;
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
      // const merchantModel = MerchantModel(fastify.prisma.merchant);
      if (Number.isNaN(request.params.id)) {
        reply.statusCode = 400;
        throw new Error("Bad request");
      }
      const merchant = await fastify.prisma.merchant.findUnique({
        where: {
          id: parseInt(request.params.id),
        },
        include: {
          stores: true,
          staffs: true,
        },
      });
      if (!merchant) {
        reply.statusCode = 404;
        throw new Error("Merchant not found");
      }
      return merchant;
    }
  );
}

export default routes;
