import express from "express";
import httpProxy from "http-proxy";
import { __dirname, containerManager } from "./server";
import { DockviewServerContainer } from "./models/Container";

export const instanceApp = express();

export const instanceProxy = httpProxy.createProxyServer({
	changeOrigin: false,
	ws: false,
	selfHandleResponse: false,
});

instanceApp.use((req, res, next) => {
	console.log("-------------- Instance request --------------");

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


instanceApp.get("/", (req, res) => {
	const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

	const target = `${protocol}://${req.hostname}:${process.env.PORT}`;

	if(req.container instanceof DockviewServerContainer) {

		console.log("Instance container");

		if(!req.container.attached) {
			res.status(404).send("Container not found.");
			return;
		}

		const proxyTarget = `${protocol}://${req.container.ip}:${req.container.port}`;

		instanceProxy.web(req, res, { 
			target: proxyTarget,
			changeOrigin: true,
			ws: false,
		});
		return;
	};



	console.log("Static");
	res.render("index", {
		data: {
			target,
		},
	});
});

// proxyApp.use("/", projectProxyHandler);

instanceApp.get("*", (req, res) => {
	res.status(404).send("Not found");
});
