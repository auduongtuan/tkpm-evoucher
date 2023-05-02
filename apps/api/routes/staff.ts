import { FastifyPluginOptions, FastifyInstance, FastifyRequest } from "fastify";
import StaffModel from "../models/StaffModel";
async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get("/staffs", async (request, reply) => {
    const staffModel = StaffModel(fastify.prisma.staff);
    const staffs = await staffModel.getAll();
    return staffs;
  });

  fastify.get(
    "/staff/:id",
    async (
      request: FastifyRequest<{
        Params: {
          id: string;
        };
      }>,
      reply
    ) => {
      const staffModel = StaffModel(fastify.prisma.staff);
      if (Number.isNaN(request.params.id)) {
        reply.statusCode = 400;
        throw new Error("Bad request");
      }
      const staff = await staffModel.findUnique({
        where: {
          id: parseInt(request.params.id),
        },
      });
      if (!staff) {
        reply.statusCode = 404;
        throw new Error("Staff not found");
      }
      return staff;
    }
  );
}

export default routes;
