import { RequestHandler } from "express";
import express from "express";
import { proxy } from "~/proxy";

import { containerMap } from "~/server";

export const projectProxyHandler: RequestHandler = (req, res, next) => {
	const subdomain = req.hostname.split(".")[0];
	// Extract projectName, version, and containerID from the subdomain
	// Assuming subdomain format: projectName--version--containerID
	const [prefix, containerID, ...rest] = subdomain.split("--");

	const secFetchSite = req.headers["sec-fetch-site"];

	// Protect route
	if (secFetchSite !== "same-origin") {
		// Deny the request
		res.status(403).send("Forbidden");
	}

	if (prefix !== "dv") {
		res.status(400).send("Invalid subdomain.");
	}

	if (!containerID) {
		res.status(400).send("Container ID not provided.");
	}

	console.log("Container ID:", containerID);

	// Check if the containerID is valid

	const container = containerMap.get(containerID);

	if (!container) {
		return res.status(404).send("Container not found.");
	}

	container.lastAccessed = Date.now();

	if (container.type === "server") {
		// Not implemented yet

		res.status(501).send("Not implemented.");

		// proxy.web(req, res, {
		// 	target: http://${container.ip}:${container.port},
		// });
		return;
	}

	express.static(container.path)(req, res, next);
};
