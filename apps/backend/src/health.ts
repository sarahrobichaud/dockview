import express from "express";
import cors from "cors";
import { containerManager } from "./server";

export const healthApp = express();

healthApp.use(cors());

healthApp.get("/:containerID", (req, res) => {
	const { containerID } = req.params;

	const container = containerManager.getContainer(containerID);

	if (!container) {
		res.status(404).json({
			success: false,
			message: "Container not found",
			code: 404
		});
		return;
	}

	res.json({
		success: true,
		status: container.status
	});
});
