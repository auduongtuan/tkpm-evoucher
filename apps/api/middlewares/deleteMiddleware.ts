import { FastifyReply, FastifyRequest } from "fastify";

const deleteMiddleWare = function (
  name: string,
  deleteByIdFunc: (id: number) => Promise<void>,
  errorHandler?: Function
) {
  return async function (
    req: FastifyRequest<{
      Params: {
        id: string;
      };
    }>,
    reply: FastifyReply
  ) {
    const deleteId = parseInt(req.params.id);
    if (!deleteId || !Number.isInteger(deleteId)) {
      reply.statusCode = 400;
      throw new Error("Bad request");
    }

    try {
      await deleteByIdFunc(deleteId);
      reply.statusCode = 204;
    } catch (err) {
      reply.statusCode = 500;
      throw new Error(`Cannot delete ${name}`);
    }
  };
};
export default deleteMiddleWare;
