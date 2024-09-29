import type { RequestHandler } from "express";

import { containerMap, vaultReader } from "~/server";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvxyz", 10);

export const setupContainer: RequestHandler = (req, res, next) => {
	const { projectName, version } = req.params;

	if (!projectName || !version) {
		res.status(400).json({
			success: false,
			code: 400,
			message: "Project or version not provided",
			type: "BadRequest",
			resource: null,
		});

		return;
	}

	const [data, err] = vaultReader.getProjectAssetPath(projectName, version);

	if (err) {
		res.status(err.code).json({
			success: false,
			message: err.message,
			type: err.name,
			code: err.code,
			resource: null,
		});
		return;
	}

	// TODO: This temporary, need to handle server containers

	const containerID = nanoid(8);

	const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
	const prefix = "dv--";
	const target = `${protocol}://${prefix}${containerID}.localhost:${process.env.PORT}/view`;

	containerMap.set(containerID, {
		type: "static",
		path: data.result,
		lastAccessed: Date.now(),
	});

	console.log("Redirecting to", target);
	res.redirect(target);
};
