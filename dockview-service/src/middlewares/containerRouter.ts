import type { RequestHandler } from "express";

import { containerMap, vaultReader } from "~/server";
import { customAlphabet } from "nanoid";
import { DockviewStaticContainer } from "~/models/Container";
import { ContainerStatus } from "~/types/containerStatus.enum";
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvxyz", 10);

export const requestContainer: RequestHandler = (req, res, next) => {
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

	const containerInstance = new DockviewStaticContainer(data.result);

	containerMap.set(containerID, containerInstance);

	fakeContainerStart(1000).then(() => {
		const container = containerMap.get(containerID);
		if (container) {
			container.status = ContainerStatus.LAUNCHING;
		}
	});
	fakeContainerStart(3000).then(() => {
		const container = containerMap.get(containerID);
		if (container) {
			container.status = ContainerStatus.BUILD_IMAGE;
		}
	});
	fakeContainerStart(6000).then(() => {
		const container = containerMap.get(containerID);
		if (container) {
			container.status = ContainerStatus.SPIN_UP;
		}
	});
	fakeContainerStart(8000).then(() => {
		const container = containerMap.get(containerID);
		if (container) {
			container.status = ContainerStatus.READY;
		}
	});
	fakeContainerStart(8700).then(() => {
		const container = containerMap.get(containerID);
		if (container) {
			container.status = ContainerStatus.TRANSITION;
		}
	});

	console.log("Redirecting to", target);
	res.json({
		success: true,
		containerURL: target,
	});
	// res.redirect(target);
};

const fakeContainerStart = (time: number) => {
	return new Promise<void>((resolve) => {
		setTimeout(() => {
			resolve();
		}, time);
	});
};
