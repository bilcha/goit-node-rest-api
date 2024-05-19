import bcript from "bcrypt";

const compareHash = (password, hashPassword) =>
  bcript.compare(password, hashPassword);

export default compareHash;
