import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { UserLoginBody, UserLoginSchema } from "database/schema/users";
import {
  comparePassword,
  computeVoucherStatus,
  excludePassword,
  simplifyStores,
} from "database";
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
      return excludePassword(req.user);
    }
  );
  fastify.get(
    "/vouchers",
    {
      onRequest: [fastify.auth.verifyUser],
    },
    async function (req, reply) {
      // if (!req.user) {
      //   reply.statusCode = 401;
      //   throw new Error("Not logged in");
      // }
      if (!req.user) return;
      const vouchers = await fastify.prisma.voucher.findMany({
        where: {
          userId: req.user.id,
        },
        include: {
          campaign: {
            include: {
              merchant: true,
              stores: {
                include: {
                  store: true,
                },
              },
            },
          },
        },
      });
      return {
        ...excludePassword(req.user),
        vouchers: vouchers.map((voucher) => ({
          ...computeVoucherStatus(voucher),
          campaign: {
            ...voucher.campaign,
            stores: simplifyStores(voucher.campaign.stores),
          },
        })),
      };
    }
  );
  fastify.post<{ Body: UserLoginBody }>(
    "/login",
    { schema: { body: UserLoginSchema } },
    async function (req, reply) {
      if (req.user) {
        reply.statusCode = 400;
        throw new Error("Already logged in");
      }
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
