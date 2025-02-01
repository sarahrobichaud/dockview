import express from "express";
import cors from "cors";
import { InstanceManagerContract } from "./lib/instance-manager/InstanceManagerContract";
import { TOKENS } from "./tokens";
import { container } from "tsyringe";

export const healthApp = express();

healthApp.use(cors());

healthApp.get("/:containerID", (req, res) => {
	const { containerID } = req.params;

	const instanceManager = container.resolve<InstanceManagerContract>(TOKENS.InstanceManager);

	const instance = instanceManager.getByID(containerID);


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
		status: instance?.status
	});
});
