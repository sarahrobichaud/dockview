import { nanoid } from "nanoid";

const node = nanoid(10);
const staticEnv = nanoid(10);
const staticServer = nanoid(10);
const envs = {
  node: node,
  static: staticEnv,
  staticServer: staticServer,
};

export default envs;