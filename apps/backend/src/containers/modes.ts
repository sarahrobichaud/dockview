import { nanoid } from "nanoid";

const dev = nanoid(10);
const prod = nanoid(10);

const modes = {
  development: dev,
  production: prod,
};

export default modes;