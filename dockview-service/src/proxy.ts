import express from "express";
import httpProxy from "http-proxy";
import path from "path";
import { projectProxyHandler } from "./proxy/projectProxy";
import { __dirname } from "./server";

export const proxyApp = express();

proxyApp.get("/view", (req, res) => {
	const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

	const target = `${protocol}://${req.hostname}:${process.env.PORT}`;

	res.render("index", {
		data: {
			target,
		},
	});
});

proxyApp.use("/", projectProxyHandler);

export const proxy = httpProxy.createProxyServer({
	changeOrigin: true,
	ws: false,
	selfHandleResponse: false,
});
