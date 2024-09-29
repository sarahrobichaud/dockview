import express from "express";
import httpProxy from "http-proxy";
import path from "path";
import { projectProxyHandler } from "./proxy/projectProxy";
import { __dirname, containerMap } from "./server";

export const proxyApp = express();

proxyApp.use((req, res, next) => {
	const [prefix, containerID] = req.hostname.split(".")[0].split("--");

	const container = containerMap.get(containerID);

	if (!container) {
		res.status(404).send("Container not found.");
		return;
	}
	req.container = container;
	next();
});

proxyApp.get("/view", (req, res) => {
	const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

	const target = `${protocol}://${req.hostname}:${process.env.PORT}`;

	res.render("index", {
		data: {
			target,
		},
	});
});

proxyApp.get("/status", (req, res, next) => {
	res.json({ status: req.container.status });
});
proxyApp.use("/", projectProxyHandler);

export const proxy = httpProxy.createProxyServer({
	changeOrigin: true,
	ws: false,
	selfHandleResponse: false,
});
