import express from "express";
import httpProxy from "http-proxy";
import path from "path";
import { projectProxyHandler } from "./proxy/projectProxy";
import { __dirname, containerManager } from "./server";

export const proxyApp = express();

//TODO: Fix typescript issues here

proxyApp.use((req, res, next) => {
	const [prefix, containerID] = req.hostname.split(".")[0].split("--");

	const container = containerManager.getContainer(containerID);

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

export const proxy = httpProxy.createProxyServer({
	changeOrigin: true,
	ws: false,
	selfHandleResponse: false,
});
