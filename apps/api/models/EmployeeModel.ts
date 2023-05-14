import { PrismaClient, Employee } from "database";

type Signup = {
  email: string;
  firstName: string;
  lastName: string;
};

function exclude<Employee, Key extends keyof Employee>(
  employee: Employee,
  keys: Key[]
): Omit<Employee, Key> {
  for (let key of keys) {
    delete employee[key];
  }
  return employee;
}

function EmployeeModel(prismaEmployee: PrismaClient["employee"]) {
  return Object.assign(prismaEmployee, {
    /**
     * Signup the first user and create a new team of one. Return the User with
     * a full name and without a password
     */
    // async signup(data: Signup): Promise<User> {
    //   return prismaUser.create({ data })
    // },
    async getAll(): Promise<Omit<Employee, "password">[]> {
      const employees = await prismaEmployee.findMany({
        include: {
          merchant: true,
        },
      });
      return employees.map((employee) => exclude(employee, ["password"]));
    },
  });
}

export default EmployeeModel;
