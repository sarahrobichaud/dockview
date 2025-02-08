import express from "express";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { instanceValidator } from "~/middlewares/proxy.middleware";
import { responses } from "~/middlewares/response.middleware";
import proxyRouter from "~/routes/v1/proxy.router";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const proxyApp = express();

proxyApp.set("view engine", "ejs");
proxyApp.set("views", path.resolve(__dirname, "..", "views"));

proxyApp.use(responses.format);

proxyApp.use('/', proxyRouter);

proxyApp.use(responses.handleErrors);

export default proxyApp;

