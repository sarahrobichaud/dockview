import express from "express";
import { projectProxyHandler } from "../proxy/projectProxy";
import { __dirname } from "../server";
import { ContainerStatus } from "../types/containerStatus.enum";
import { container } from "tsyringe";
import { TOKENS } from "../tokens";
import { InstanceManagerContract } from "../lib/instance-manager/InstanceManagerContract";
import path from "node:path";
import { instanceValidator } from "~/middlewares/proxy.middleware";
import { ProxyRouter } from "~/routes/v1/proxy.router";
import { responses } from "~/middlewares/response.middleware";
import { InstanceRouter } from "~/routes/v1/instance.router";

export const instanceApp = express();

export function createInstanceApp() {

    instanceApp.set("view engine", "ejs");
    instanceApp.set("views", path.resolve(__dirname, "views"));


    instanceApp.use(responses.format);
    instanceApp.use(instanceValidator);

    const instanceRouter = new InstanceRouter();
    instanceApp.use('/', instanceRouter.router);

    instanceApp.use(responses.handleErrors);

    return instanceApp;
}
