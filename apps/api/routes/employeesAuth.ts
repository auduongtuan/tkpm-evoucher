import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { EmployeeLoginBody, EmployeeLoginSchema } from "../schema/employees";
import { comparePassword } from "database";
async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get(
    "/",
    { onRequest: [fastify.auth.verifyEmployee] },
    async function (req, reply) {
      if (!req.employee) {
        reply.statusCode = 401;
        throw new Error("Not logged in");
      }
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
      const token = fastify.auth.sign({
        employeeId: employee.id,
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
