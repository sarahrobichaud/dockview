import express from "express";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { instanceValidator } from "~/middlewares/proxy.middleware";
import { responses } from "~/middlewares/response.middleware";
import instanceRouter from "~/routes/v1/instance.router";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const instanceApp = express();

instanceApp.set("view engine", "ejs");
instanceApp.set("views", path.resolve(__dirname, "..", "views"));

instanceApp.use(responses.format);
instanceApp.use(instanceValidator);

instanceApp.use('/', instanceRouter);

instanceApp.use(responses.handleErrors);

export default instanceApp;