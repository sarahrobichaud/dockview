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

export const proxyApp = express();

export function createProxyApp() {

	proxyApp.set("view engine", "ejs");
	proxyApp.set("views", path.resolve(__dirname, "views"));


	proxyApp.use(responses.format);
	proxyApp.use(instanceValidator);


	const proxyRouter = new ProxyRouter();
	proxyApp.use('/', proxyRouter.router);

	proxyApp.use(responses.handleErrors);

	return proxyApp;
}
