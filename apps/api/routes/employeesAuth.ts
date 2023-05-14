import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { EmployeeLoginBody, EmployeeLoginSchema } from "../schema/employees";
import { comparePassword } from "database";
async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.decorate("verifyEmployee", async function (req, reply, done) {
    try {
      await req.jwtVerify();
      const employee = await fastify.prisma.employee.findUnique({
        where: {
          id: req.user.id,
        },
      });
      if (!employee) {
        reply.statusCode = 401;
        throw new Error("Employee not found");
      }
      req.employee = employee;
      done();
    } catch (error) {
      done(error);
    }
  });

  fastify.decorate(
    "verifySystemAdmin",
    async function (req, reply, done) {
      if (!req.employee.systemAdmin) {
        reply.statusCode = 401;
        throw new Error("Employee not found or not an admin");
      }
      done();
    },
    ["verifyEmployee"]
  );
  fastify.get(
    "/",
    { onRequest: [fastify.verifyEmployee] },
    async function (req, reply) {
      return req.employee;
    }
  );
  fastify.post<{ Body: EmployeeLoginBody }>(
    "/login",
    { schema: { body: EmployeeLoginSchema } },
    async function (req, reply) {
      const { email, password } = req.body;
      const employee = await fastify.prisma.employee.findUnique({
        where: {
          email,
        },
      });
      if (!employee || comparePassword(password, employee.password) === false) {
        reply.statusCode = 401;
        throw new Error("Email or password is incorrect");
      }
      const token = fastify.jwt.sign({
        id: employee.id,
        email: employee.email,
      });
      return { token };
    }
  );
  // fastify.post("/logout", async function (req, reply) {
  //   reply.clearCookie("token");
  //   return { message: "Logged out" };
  // });
}
export default routes;
