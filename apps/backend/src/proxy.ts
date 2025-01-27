import express from "express";
import httpProxy from "http-proxy";
import path from "path";
import { projectProxyHandler } from "./proxy/projectProxy";
import { __dirname, containerManager } from "./server";
import { DockviewServerContainer } from "./models/Container";

export const proxyApp = express();

export const proxy = httpProxy.createProxyServer({
	changeOrigin: true,
	ws: false,
	selfHandleResponse: false,
});

proxyApp.use((req, res, next) => {

	console.log("-------------- Proxy request --------------");

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

// proxyApp.use("/instance", (req, res, next) => {
// 	console.log("Instance request");

// 	if(req.container instanceof DockviewServerContainer) {

// 		return proxy.web(req, res, {
// 			target: `http://${req.container.ip}:${req.container.port}`,
// 			changeOrigin: true,
// 			ws: false,
// 			selfHandleResponse: false,
// 		})
// 	}
// 	next();
// });
// // proxyApp.use("/instance", projectProxyHandler);

proxyApp.get("*", (req, res) => {

	res.status(404).send("Not found");
});
