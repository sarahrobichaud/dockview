import express  from "express";
import httpProxy from "http-proxy";
import { projectProxyHandler } from "./proxy/projectProxy";
import { __dirname, containerManager } from "./server";
import { ContainerStatus } from "./types/containerStatus.enum";

//@ts-ignore
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

	if(req.container.status !== ContainerStatus.TRANSITION){
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
