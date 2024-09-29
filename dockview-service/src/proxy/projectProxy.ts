import { RequestHandler } from "express";
import express from "express";
import {
	DockviewServerContainer,
	DockviewStaticContainer,
} from "~/models/Container";
import { containerManager } from "~/server";

export const projectProxyHandler: RequestHandler = (req, res, next) => {
	const subdomain = req.hostname.split(".")[0];
	// Extract projectName, version, and containerID from the subdomain
	// Assuming subdomain format: projectName--version--containerID
	const [prefix, containerID] = subdomain.split("--");

	const secFetchSite = req.headers["sec-fetch-site"];

	// Protect route
	if (secFetchSite !== "same-origin") {
		// Deny the request
		console.log("Forbidden" + req.hostname);
		res.redirect("/");
		// res.status(403).send("Forbidden");
	}

	if (prefix !== "dv") {
		res.status(400).send("Invalid subdomain.");
	}

	if (!containerID) {
		res.status(400).send("Container ID not provided.");
	}

	console.log("Container ID:", containerID);

	// Check if the containerID is valid
	const container = containerManager.getContainer(containerID);

	if (!container) {
		return res.status(404).send("Container not found.");
	}

	container.updateLastAccessed();

	if (!container.isReady) {
		return res.render("launching");
	}

	if (container instanceof DockviewServerContainer) {
		// Not implemented yet

		res.status(501).send("Not implemented.");

		// proxy.web(req, res, {
		// 	target: http://${container.ip}:${container.port},
		// });
		return;
	}

	if (container instanceof DockviewStaticContainer) {
		express.static(container.path)(req, res, next);
	}
};
