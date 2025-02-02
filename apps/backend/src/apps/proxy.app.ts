import express from "express";
import httpProxy from "http-proxy";
import { projectProxyHandler } from "../proxy/projectProxy";
import { __dirname } from "../server";
import { ContainerStatus } from "../types/containerStatus.enum";
import { container } from "tsyringe";
import { TOKENS } from "../tokens";
import { InstanceManagerContract } from "../lib/instance-manager/InstanceManagerContract";
import path from "node:path";
import { proxy } from "../proxy/projectProxy";

//@ts-ignore
export const proxyApp = express();


export function createProxyApp() {

	proxyApp.set("view engine", "ejs");
	proxyApp.set("views", path.resolve(__dirname, "views"));

	proxyApp.use((req, res, next) => {

		const [prefix, containerID] = req.hostname.split(".")[0].split("--");


		const instanceManager = container.resolve<InstanceManagerContract>(TOKENS.InstanceManager);

		const instance = instanceManager.getByID(containerID);

		if (!container) {
			res.status(404).send("Container not found.");
			return;
		}

		//@ts-ignore
		req.container = container;
		next();
	});

	proxyApp.get("/status", (req, res, next) => {
		//@ts-ignore
		res.json({ status: req.container.status });
	});


	proxyApp.get("/", (req, res) => {
		const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

		const target = `${protocol}://${req.hostname}:${process.env.PORT}`;

		if (req.container.status !== ContainerStatus.TRANSITION) {
			res.render("launching");
			return;
		}

		res.render("index", {
			data: {
				target,
			},
		});
	});


	proxyApp.use("/", projectProxyHandler);
	proxyApp.use("/instance", projectProxyHandler);

	proxyApp.get("*", (req, res) => {

		res.status(404).send("Not found");
	});

	return proxyApp;
}
