import { FastifyReply, FastifyRequest } from "fastify";

export const deleteMiddleware = function (
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

export const listMiddleware = function <T>(
  name: string,
  listFunc: () => Promise<T[]>,
  errorHandler?: Function
) {
  return async function (
    req: FastifyRequest<{
      // Params: {
      //   id: string;
      // };
    }>,
    reply: FastifyReply
  ) {
    try {
      const entries = await listFunc();
      console.log(entries);
      return entries;
    } catch (err) {
      reply.statusCode = 500;
      throw new Error(`Cannot list ${name}`);
    }
  };
};

export const viewMiddleware = function <T>(
  name: string,
  viewByIdFunc: (id: number) => Promise<T>,
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
    const viewId = parseInt(req.params.id);
    if (!viewId || !Number.isInteger(viewId)) {
      reply.statusCode = 400;
      throw new Error("Bad request");
    }

    try {
      const entry = await viewByIdFunc(viewId);
      reply.statusCode = 200;
      return entry;
    } catch (err) {
      reply.statusCode = 500;
      throw new Error(`Cannot view ${name}`);
    }
  };
};
