import { PrismaClient, Staff } from "database";

type Signup = {
  email: string;
  firstName: string;
  lastName: string;
};

function exclude<Staff, Key extends keyof Staff>(
  staff: Staff,
  keys: Key[]
): Omit<Staff, Key> {
  for (let key of keys) {
    delete staff[key];
  }
  return staff;
}

function Staffs(prismaStaff: PrismaClient["staff"]) {
  return Object.assign(prismaStaff, {
    /**
     * Signup the first user and create a new team of one. Return the User with
     * a full name and without a password
     */
    // async signup(data: Signup): Promise<User> {
    //   return prismaUser.create({ data })
    // },
    async getAll(): Promise<Omit<Staff, "password">[]> {
      const staffs = await prismaStaff.findMany({
        include: {
          merchant: true,
        },
      });
      return staffs.map((staff) => exclude(staff, ["password"]));
    },
  });
}

export default Staffs;
