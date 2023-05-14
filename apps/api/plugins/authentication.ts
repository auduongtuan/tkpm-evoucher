import fp from "fastify-plugin";
import { createSigner, createVerifier } from "fast-jwt";
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
export interface EmployeePayload {
  id: number;
  email: string;
}
export default fp(async (fastify, opts) => {
  const signSync = createSigner({ key: "R83MDOLQ" });
  const verifySync = createVerifier({ key: "R83MDOLQ" });
  const verifyEmployeeBase = async (
    req: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const auth = req.headers.authorization;
      const token = auth ? auth.split(" ")[1] : undefined;
      if (!token) return;
      const payload = verifySync(token) as EmployeePayload;
      if (!payload) {
        reply.statusCode = 401;
        throw new Error("Employee not found");
      }
      const employee = await fastify.prisma.employee.findUnique({
        where: {
          id: payload.id,
        },
      });
      if (!employee) {
        reply.statusCode = 401;
        throw new Error("Employee not found");
      }
      req.employee = employee;
    } catch (error) {
      throw error;
    }
  };
  const verifyEmployee = async (
    req: FastifyRequest,
    reply: FastifyReply,
    done: HookHandlerDoneFunction
  ) => {
    await verifyEmployeeBase(req, reply);
    done();
  };

  const verifySystemAdmin = async (
    req: FastifyRequest,
    reply: FastifyReply,
    done: HookHandlerDoneFunction
  ) => {
    await verifyEmployeeBase(req, reply);
    if (!req.employee || !req.employee.systemAdmin) {
      reply.statusCode = 401;
      throw new Error("Employee not found or not an admin");
    }
    done();
  };

  fastify.decorate("auth", {
    verifyEmployee,
    verifySystemAdmin,
    sign: signSync,
  });
});
