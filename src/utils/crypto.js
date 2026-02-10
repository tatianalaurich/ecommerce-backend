import bcrypt from "bcrypt";

export const createHash = (plainPassword) => bcrypt.hashSync(plainPassword, bcrypt.genSaltSync(10));
export const isValidPassword = (plainPassword, hashedPassword) => bcrypt.compareSync(plainPassword, hashedPassword);
