import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { UserLoginBody, UserLoginSchema } from "../schema/users";
import { comparePassword } from "database";
async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get(
    "/",
    {
      onRequest: [fastify.auth.verifyUser],
    },
    async function (req, reply) {
      if (!req.user) {
        reply.statusCode = 401;
        throw new Error("Not logged in");
      }
      return req.user;
    }
  );
  fastify.post<{ Body: UserLoginBody }>(
    "/login",
    { schema: { body: UserLoginSchema } },
    async function (req, reply) {
      const { email, password } = req.body;
      const user = await fastify.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user || comparePassword(password, user.password) === false) {
        reply.statusCode = 401;
        throw new Error("Email or password is incorrect");
      }
      const token = fastify.auth.sign({
        userId: user.id,
      });
      return { token };
    }
  );
}
export default routes;
