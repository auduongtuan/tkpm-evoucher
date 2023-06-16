import bcrypt from "bcrypt";
const salt = bcrypt.genSaltSync(10);
import { User } from "@prisma/client";
import type { Extended } from "helpers";

export function hashPassword(password: string) {
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}
export function comparePassword(password: string, hashedPassword: string) {
  const match = bcrypt.compareSync(password, hashedPassword);
  return match;
}
type ExtendedUser = Extended<User>;
export function excludePassword(users: ExtendedUser[] | ExtendedUser | null) {
  if (!users) return null;
  if (Array.isArray(users)) {
    return users.map((user) => {
      const { password, ...rest } = user;
      return rest;
    });
  } else {
    const { password, ...rest } = users;
    return rest;
  }
}
