import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
function createPrismaClient() {
  const prisma = new PrismaClient().$extends({
    result: {
      // user: {
      //   fullName: {
      //     needs: { firstName: true, lastName: true },
      //     compute(user) {
      //       return `${user.firstName} ${user.lastName}`
      //     },
      //   },
      // },
      campaign: {
        status: {
          needs: { startedAt: true, endedAt: true },
          compute(campaign) {
            const currentDate = dayjs();
            if (dayjs(campaign.endedAt).isBefore(currentDate, "day")) {
              return "expired";
            }
            if (dayjs(campaign.startedAt).isAfter(currentDate, "day")) {
              return "upcoming";
            }
            return "ongoing";
          },
        },
      },
    },
  });
  return prisma;
}
export default createPrismaClient;
