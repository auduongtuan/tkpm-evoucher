import { FastifyPluginOptions, FastifyInstance, FastifyRequest } from "fastify";
import { IdParamsSchema, IdParamsType } from "database/schema/id";
import { GameCreateSchema, GameCreateBody } from "database/schema/games";
async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get("/", async function (req, reply) {
    return fastify.prisma.game.findMany({
      include: {
        campaigns: true,
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
      return await fastify.prisma.game.findUnique({
        where: {
          id: req.params.id,
        },
        include: {
          campaigns: true,
        },
      });
    }
  );
  fastify.post<{ Body: GameCreateBody }>(
    "/",
    {
      schema: { body: GameCreateSchema },
      onRequest: [fastify.auth.verifySystemAdmin],
    },
    async function (req, reply) {
      return fastify.prisma.game.create({
        data: {
          ...req.body,
        },
      });
    }
  );
  fastify.put<{ Body: GameCreateBody; Params: IdParamsType }>(
    "/:id",
    {
      schema: { body: GameCreateSchema, params: IdParamsSchema },
      onRequest: [fastify.auth.verifySystemAdmin],
    },
    async function (req, reply) {
      return await fastify.prisma.game.update({
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
    {
      schema: { params: IdParamsSchema },
      onRequest: [fastify.auth.verifySystemAdmin],
    },
    async function (req, reply) {
      await fastify.prisma.game.delete({
        where: {
          id: req.params.id,
        },
      });
    }
  );
}

export default routes;
