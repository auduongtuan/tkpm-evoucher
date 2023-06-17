import fp from "fastify-plugin";
import { createSigner, createVerifier } from "fast-jwt";
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
export interface EmployeePayload {
  employeeId: number;
}

export interface UserPayload {
  userId: number;
}
export default fp(async (fastify, opts) => {
  const signSync = createSigner({
    key: "R83MDOLQ",
    expiresIn: 2592000000, // 30days
  });
  const verifySync = createVerifier({ key: "R83MDOLQ" });
  const verifyEmployeeBase = async (
    req: FastifyRequest,
    reply: FastifyReply
  ) => {
    const auth = req.headers.authorization;
    const token = auth ? auth.split(" ")[1] : undefined;
    if (!token) {
      reply.statusCode = 401;
      throw new Error("Not logged in");
    }

    const payload = verifySync(token) as EmployeePayload;
    if (!payload) {
      reply.statusCode = 401;
      throw new Error("Token invalid");
    }
    const employee = await fastify.prisma.employee.findUnique({
      where: {
        id: payload.employeeId,
      },
    });
    if (!employee) {
      reply.statusCode = 401;
      throw new Error("Employee not found");
    }
    req.employee = employee;
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
  const verifyEmployeeOrUser = async (
    req: FastifyRequest,
    reply: FastifyReply,
    done: HookHandlerDoneFunction
  ) => {
    const auth = req.headers.authorization;
    const token = auth ? auth.split(" ")[1] : undefined;
    if (!token) {
      reply.statusCode = 401;
      throw new Error("Not logged in");
    }
    const payload = verifySync(token) as UserPayload | EmployeePayload;
    if (!payload) {
      reply.statusCode = 401;
      throw new Error("Invalid Token");
    }
    if ("userId" in payload) {
      const user = await fastify.prisma.user.findUnique({
        where: {
          id: payload.userId,
        },
      });
      if (!user) {
        reply.statusCode = 401;
        throw new Error("User not found");
      }
      req.user = user;
    }
    if ("employeeId" in payload) {
      const employee = await fastify.prisma.employee.findUnique({
        where: {
          id: payload.employeeId,
        },
      });
      if (!employee) {
        reply.statusCode = 401;
        throw new Error("Employee not found");
      }
      req.employee = employee;
    }
    done();
  };
  const verifyUser = async (
    req: FastifyRequest,
    reply: FastifyReply,
    done: HookHandlerDoneFunction
  ) => {
    const auth = req.headers.authorization;
    const token = auth ? auth.split(" ")[1] : undefined;
    if (!token) {
      reply.statusCode = 401;
      throw new Error("Not logged in");
    }
    const payload = verifySync(token) as UserPayload;
    if (!payload) {
      reply.statusCode = 401;
      throw new Error("Invalid Token");
    }
    const user = await fastify.prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });
    if (!user) {
      reply.statusCode = 401;
      throw new Error("User not found");
    }
    req.user = user;
    done();
  };
  const verifyHasMerchantPermission = (
    req: FastifyRequest,
    reply: FastifyReply,
    merchantId: number
  ) => {
    if (
      !req.employee ||
      !req.employee.systemAdmin ||
      merchantId !== req.employee.merchantId
    ) {
      reply.statusCode = 403;
      throw new Error("Do not have permission");
    }
  };
  fastify.decorate("auth", {
    verifyEmployee,
    verifySystemAdmin,
    verifyUser,
    verifyHasMerchantPermission,
    sign: signSync,
  });
});
