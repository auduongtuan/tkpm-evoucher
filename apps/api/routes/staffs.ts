import { FastifyPluginOptions, FastifyInstance, FastifyRequest } from "fastify";
import StaffModel from "../models/StaffModel";
import { listMiddleware, deleteMiddleware } from "../middlewares/crud";
async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get(
    "/",
    listMiddleware("Staff", async () => {
      const staffModel = StaffModel(fastify.prisma.staff);
      const staffs = await staffModel.getAll();
      return staffs;
    })
  );

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
      const staffModel = StaffModel(fastify.prisma.staff);
      if (Number.isNaN(request.params.id)) {
        reply.statusCode = 400;
        throw new Error("Bad request");
      }
      const staff = await staffModel.findUnique({
        where: {
          id: parseInt(request.params.id),
        },
        include: {
          merchant: true,
        },
      });
      if (!staff) {
        reply.statusCode = 404;
        throw new Error("Staff not found");
      }
      return staff;
    }
  );

  fastify.delete(
    "/:id",
    deleteMiddleware("Staff", async (id) => {
      await fastify.prisma.staff.delete({
        where: {
          id: id,
        },
      });
    })
  );
}

export default routes;
