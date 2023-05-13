import { FastifyPluginOptions, FastifyInstance, FastifyRequest } from "fastify";
import { IdParamsSchema, IdParamsType } from "../schema/id";
import { StaffCreateSchema, StaffCreateBody } from "../schema/staffs";
async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get("/", async function (req, reply) {
    return fastify.prisma.staff.findMany({
      include: {
        merchant: true,
      },
      orderBy: {
        id: "asc",
      },
    });
  });
  fastify.get<{ Params: IdParamsType }>(
    "/:id",
    { schema: { params: IdParamsSchema } },
    async function (req, reply) {
      console.log(req.params.id);
      return await fastify.prisma.staff.findUnique({
        where: {
          id: req.params.id,
        },
        include: {
          merchant: true,
        },
      });
    }
  );
  fastify.post<{ Body: StaffCreateBody }>(
    "/",
    { schema: { body: StaffCreateSchema } },
    async function (req, reply) {
      return fastify.prisma.staff.create({
        data: {
          ...req.body,
        },
      });
    }
  );
  fastify.put<{ Body: StaffCreateBody; Params: IdParamsType }>(
    "/:id",
    { schema: { body: StaffCreateSchema, params: IdParamsSchema } },
    async function (req, reply) {
      return await fastify.prisma.staff.update({
        where: {
          id: req.params.id,
        },
        data: {
          ...req.body,
        },
      });
    }
  );
  fastify.delete<{ Params: IdParamsType }>(
    "/:id",
    { schema: { params: IdParamsSchema } },
    async function (req, reply) {
      await fastify.prisma.staff.delete({
        where: {
          id: req.params.id,
        },
      });
    }
  );
}

export default routes;
