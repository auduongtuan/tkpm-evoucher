import bcrypt from "bcrypt";
const salt = bcrypt.genSaltSync(10);

export function hashPassword(password: string) {
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}
export function comparePassword(password: string, hashedPassword: string) {
  const match = bcrypt.compareSync(password, hashedPassword);
  return match;
}
